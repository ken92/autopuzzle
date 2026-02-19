import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { getGame, type GameName } from './games';
import { Box } from '@mui/material';
import MainMenu from './lib/MainMenu';
import type { GameDifficulty } from './lib/types';
import { BANK_LABELS, type WordBankKey } from './lib/wordBank';
import type { ReaderDocument } from './lib/readerTypes';

const DEFAULT_GAME_LENGTH_SECONDS = 60;
const DEFAULT_SOLUTION_DISPLAY_SECONDS = 10;
const DEFAULT_READER_LENGTH_SECONDS = 120;
const DEFAULT_READER_SCROLL_PIXELS_PER_SECOND = 20;

enum GameState {
  MAIN_MENU = 'main_menu',
  IN_GAME = 'in_game',
}

const getRandomGameName = (games: GameName[]): GameName | null => {
  if (games.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * games.length);
  return games[randomIndex];
};

function App() {
  const timerRef = useRef<number | null>(null);
  const currentReaderDocumentRef = useRef<ReaderDocument | null>(null);
  const readerPositionGetterRef = useRef<(() => number) | null>(null);
  const handleTimerEndRef = useRef<(finishedGame: GameName) => void>(() => {});
  const readerResumeProtectionFloorRef = useRef<number | null>(null);
  const readerResumeProtectionTimerRef = useRef<number | null>(null);
  const [selectedWordBanks, setSelectedWordBanks] = useState<Set<WordBankKey>>(new Set());
  const [gameState, setGameState] = useState<GameState>(GameState.MAIN_MENU);
  const [selectedGames, setSelectedGames] = useState<Partial<Record<GameName, boolean>>>({});
  const [selectedDifficulties, setSelectedDifficulties] = useState<Partial<Record<GameName, GameDifficulty>>>({});
  const [currentGameName, setCurrentGameName] = useState<GameName | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [gameInstanceKey, setGameInstanceKey] = useState<number>(0);
  const [gameLengthSeconds, setGameLengthSeconds] = useState<number>(DEFAULT_GAME_LENGTH_SECONDS);
  const [showSolutionSeconds, setShowSolutionSeconds] = useState<number>(DEFAULT_SOLUTION_DISPLAY_SECONDS);
  const [secondsLeft, setSecondsLeft] = useState<number>(DEFAULT_GAME_LENGTH_SECONDS);
  const [readerDocument, setReaderDocument] = useState<ReaderDocument | null>(null);
  const [readerLengthSeconds, setReaderLengthSeconds] = useState<number>(DEFAULT_READER_LENGTH_SECONDS);
  const [readerScrollPixelsPerSecond, setReaderScrollPixelsPerSecond] = useState<number>(DEFAULT_READER_SCROLL_PIXELS_PER_SECOND);
  const [readerScrollPosition, setReaderScrollPosition] = useState<number>(0);
  const readerScrollPositionRef = useRef<number>(0);

  const clearReaderResumeProtection = () => {
    readerResumeProtectionFloorRef.current = null;
    if (readerResumeProtectionTimerRef.current) {
      window.clearTimeout(readerResumeProtectionTimerRef.current);
      readerResumeProtectionTimerRef.current = null;
    }
  };

  const beginReaderResumeProtection = (floor: number) => {
    clearReaderResumeProtection();
    readerResumeProtectionFloorRef.current = floor;
    readerResumeProtectionTimerRef.current = window.setTimeout(() => {
      clearReaderResumeProtection();
    }, 8000);
  };

  const handleReaderScrollPositionChange = (position: number, source = 'unknown') => {
    if (currentGameName !== 'Reader' && source !== 'snapshot_mode_switch' && source !== 'snapshot_timer_end') {
      return;
    }

    const current = readerScrollPositionRef.current;
    if (Math.abs(position - current) < 1) {
      return;
    }

    const floor = readerResumeProtectionFloorRef.current;
    if (floor !== null) {
      if (position + 1 < floor) {
        return;
      }
      clearReaderResumeProtection();
    }
    setReaderScrollPosition(position);
  };

  const handleTimerEnd = (finishedGame: GameName) => {
    if (finishedGame === 'Reader') {
      const position = readerPositionGetterRef.current?.();
      if (typeof position === 'number') {
        handleReaderScrollPositionChange(position, 'snapshot_timer_end');
      }
      setGameInstanceKey((prev) => prev + 1);
      handleStartGame();
      return;
    }

    setShowSolution(true);
    setTimeout(() => {
      setShowSolution(false);
      setGameInstanceKey((prev) => prev + 1);
      handleStartGame();
    }, 1000 * showSolutionSeconds);
  };
  handleTimerEndRef.current = handleTimerEnd;

  const eligibleGameNames = useMemo(() => {
    return (Object.keys(selectedGames) as GameName[])
      .filter((gameName) => Boolean(selectedGames[gameName]))
      .filter((gameName) => gameName !== 'Reader' || Boolean(readerDocument));
  }, [readerDocument, selectedGames]);

  const handleStartGame = () => {
    let latestReaderPosition = readerScrollPositionRef.current;
    if (currentGameName === 'Reader') {
      const position = readerPositionGetterRef.current?.();
      if (typeof position === 'number') {
        handleReaderScrollPositionChange(position, 'snapshot_mode_switch');
        latestReaderPosition = position;
      }
    }

    const game = getRandomGameName(eligibleGameNames);
    if (game) {
      setCurrentGameName(game);
      setGameState(GameState.IN_GAME);
      const duration = game === 'Reader' ? readerLengthSeconds : gameLengthSeconds;
      setSecondsLeft(duration);
      if (game === 'Reader') {
        beginReaderResumeProtection(latestReaderPosition);
      } else {
        clearReaderResumeProtection();
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const newTimerId = window.setInterval(() => {
        setSecondsLeft((prev) => {
          return Math.max(prev - 1, 0);
        });
      }, 1000);

      timerRef.current = newTimerId;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearReaderResumeProtection();
    };
  }, []);

  useEffect(() => {
    if (gameState !== GameState.IN_GAME) return;
    if (!currentGameName) return;
    if (secondsLeft > 0) {
      if (currentGameName !== 'Reader') {
        window.scrollTo(0, 0);
      }
      return;
    }

    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    handleTimerEndRef.current(currentGameName);
  }, [currentGameName, gameState, secondsLeft]);

  const handleToggleGame = (gameName: GameName) => {
    setSelectedGames((prev) => ({ ...prev, [gameName]: !prev[gameName] }));
    if (gameName === 'Reader') return;
    setSelectedDifficulties((prev) => ({ ...prev, [gameName]: prev[gameName] || 'hard' }));
  };

  const handleToggleWordBank = (bank: WordBankKey, newValue: boolean) => {
    setSelectedWordBanks((prev) => {
      const copy = new Set(prev);
      if (!newValue) copy.delete(bank);
      else copy.add(bank);
      return copy;
    });
  };

  const handleToggleAllWordBanks = (newValue: boolean) => {
    if (!newValue) {
      setSelectedWordBanks(new Set());
    } else {
      setSelectedWordBanks(new Set(BANK_LABELS as WordBankKey[]));
    }
  };

  const setReaderDocumentWithCleanup = (nextDocument: ReaderDocument | null) => {
    setReaderDocument((previousDocument) => {
      if (previousDocument?.kind === 'pdf') {
        URL.revokeObjectURL(previousDocument.url);
      }
      return nextDocument;
    });
    setReaderScrollPosition(0);
  };

  const handleReaderFileSelected = async (file: File | null) => {
    if (!file) {
      setReaderDocumentWithCleanup(null);
      return;
    }

    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      setReaderDocumentWithCleanup({
        kind: 'pdf',
        name: file.name,
        url: URL.createObjectURL(file),
      });
      return;
    }

    const text = await file.text();
    setReaderDocumentWithCleanup({
      kind: 'text',
      name: file.name,
      text,
    });
  };

  useEffect(() => {
    readerScrollPositionRef.current = readerScrollPosition;
  }, [readerScrollPosition]);

  useEffect(() => {
    currentReaderDocumentRef.current = readerDocument;
  }, [readerDocument]);

  const GameStateComponent = useMemo(() => {
    if (!currentGameName) return null;
    return getGame(currentGameName);
  }, [currentGameName]);

  useEffect(() => {
    return () => {
      const currentReaderDocument = currentReaderDocumentRef.current;
      if (currentReaderDocument?.kind === 'pdf') {
        URL.revokeObjectURL(currentReaderDocument.url);
      }
    };
  }, []);

  return (
    <Box width='100%'>
      {gameState === GameState.MAIN_MENU ? (
        <MainMenu
          selectedGames={selectedGames}
          onToggleGame={handleToggleGame}
          onStartGame={handleStartGame}
          canStart={eligibleGameNames.length > 0}
          readerIsSelected={Boolean(selectedGames.Reader)}
          hasReaderDocument={Boolean(readerDocument)}
          gameLengthSeconds={gameLengthSeconds}
          setGameLengthSeconds={setGameLengthSeconds}
          showSolutionSeconds={showSolutionSeconds}
          setShowSolutionSeconds={setShowSolutionSeconds}
          readerLengthSeconds={readerLengthSeconds}
          setReaderLengthSeconds={setReaderLengthSeconds}
          readerScrollPixelsPerSecond={readerScrollPixelsPerSecond}
          setReaderScrollPixelsPerSecond={setReaderScrollPixelsPerSecond}
          readerDocumentName={readerDocument?.name || null}
          onReaderFileSelected={handleReaderFileSelected}
          clearReaderFile={() => setReaderDocumentWithCleanup(null)}
          selectedDifficulties={selectedDifficulties}
          setSelectedDifficulties={setSelectedDifficulties}
          selectedWordBanks={selectedWordBanks}
          toggleWordBank={handleToggleWordBank}
          toggleSelectAllWordBanks={handleToggleAllWordBanks}
        />
      ) : GameStateComponent && currentGameName ? (
        <GameStateComponent
          difficulty={selectedDifficulties[currentGameName] || 'hard'}
          showSolution={showSolution}
          secondsLeft={secondsLeft}
          key={gameInstanceKey}
          wordBanks={selectedWordBanks}
          readerDocument={readerDocument}
          readerScrollPixelsPerSecond={readerScrollPixelsPerSecond}
          readerScrollPosition={readerScrollPosition}
          onReaderScrollPositionChange={handleReaderScrollPositionChange}
          setReaderPositionGetter={(getter) => {
            readerPositionGetterRef.current = getter;
          }}
        />
      ) : null}
    </Box>
  )
}

export default App;
