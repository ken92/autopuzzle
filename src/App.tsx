import { useEffect, useMemo, useRef, useState } from 'react'
import './App.css'
import { getGame, type GameName } from './games';
import { Box, Container } from '@mui/material';
import MainMenu from './lib/MainMenu';
import type { GameDifficulty } from './lib/types';

const DEFAULT_GAME_LENGTH_SECONDS = 60;
const DEFAULT_SOLUTION_DISPLAY_SECONDS = 10;

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
  const [gameState, setGameState] = useState<GameState>(GameState.MAIN_MENU);
  const [selectedGames, setSelectedGames] = useState<Partial<Record<GameName, boolean>>>({});
  const [selectedDifficulties, setSelectedDifficulties] = useState<Partial<Record<GameName, GameDifficulty>>>({});
  const [currentGameName, setCurrentGameName] = useState<GameName | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);
  const [gameInstanceKey, setGameInstanceKey] = useState<number>(0);
  const [gameLengthSeconds, setGameLengthSeconds] = useState<number>(DEFAULT_GAME_LENGTH_SECONDS);
  const [showSolutionSeconds, setShowSolutionSeconds] = useState<number>(DEFAULT_SOLUTION_DISPLAY_SECONDS);
  const [secondsLeft, setSecondsLeft] = useState<number>(DEFAULT_GAME_LENGTH_SECONDS);

  const handleTimerEnd = () => {
    setShowSolution(true);
    setTimeout(() => {
      setShowSolution(false);
      setGameInstanceKey((prev) => prev + 1);
      handleStartGame();
    }, 1000 * showSolutionSeconds);
  };

  const handleStartGame = () => {
    const game = getRandomGameName(Object.keys(selectedGames).filter((game) => selectedGames[game as GameName]) as GameName[]);
    if (game) {
      setCurrentGameName(game);
      setGameState(GameState.IN_GAME);
      setSecondsLeft(gameLengthSeconds);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }

      const newTimerId = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            handleTimerEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      timerRef.current = newTimerId;
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const handleToggleGame = (game: GameName) => {
    setSelectedGames((prev) => ({ ...prev, [game]: !prev[game] }));
    setSelectedDifficulties((prev) => ({ ...prev, [game]: prev[game] || 'hard' }));
  };

  const GameStateComponent = useMemo(() => {
    if (!currentGameName) return null;
    return getGame(currentGameName);
  }, [currentGameName]);

  return (
    <Container>
      <Box height='80vh'>
        <Box height='80vh'>
          {gameState === GameState.MAIN_MENU ? (
            <MainMenu
              selectedGames={selectedGames}
              onToggleGame={handleToggleGame}
              onStartGame={handleStartGame}
              gameLengthSeconds={gameLengthSeconds}
              setGameLengthSeconds={setGameLengthSeconds}
              showSolutionSeconds={showSolutionSeconds}
              setShowSolutionSeconds={setShowSolutionSeconds}
            />
          ) : GameStateComponent && currentGameName ? (
            <GameStateComponent
              difficulty={selectedDifficulties[currentGameName] || 'hard'}
              showSolution={showSolution}
              secondsLeft={secondsLeft}
              key={gameInstanceKey}
            />
          ) : null}
        </Box>
      </Box>
    </Container>
  )
}

export default App;
