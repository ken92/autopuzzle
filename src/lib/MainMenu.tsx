import GameSelectionList from './GameSelectionList';
import { hasDifficulty, type GameName } from '../games';
import { Button, Container, Grid, Typography } from '@mui/material';
import Settings from './Settings';
import { useMemo } from 'react';
import type { GameDifficulty } from './types';
import type { WordBankKey } from './wordBank';

export interface MainMenuProps {
  selectedGames: Partial<Record<GameName, boolean>>;
  onToggleGame: (game: GameName) => void;
  onStartGame: () => void;
  canStart: boolean;
  readerIsSelected: boolean;
  hasReaderDocument: boolean;
  gameLengthSeconds: number;
  setGameLengthSeconds: (seconds: number) => void;
  showSolutionSeconds: number;
  setShowSolutionSeconds: (seconds: number) => void;
  readerLengthSeconds: number;
  setReaderLengthSeconds: (seconds: number) => void;
  readerScrollPixelsPerSecond: number;
  setReaderScrollPixelsPerSecond: (speed: number) => void;
  readerDocumentName: string | null;
  onReaderFileSelected: (file: File | null) => Promise<void>;
  clearReaderFile: () => void;
  selectedDifficulties: Partial<Record<GameName, GameDifficulty>>;
  setSelectedDifficulties: (difficulties: Partial<Record<GameName, GameDifficulty>>) => void;
  selectedWordBanks: Set<WordBankKey>;
  toggleWordBank: (bank: WordBankKey, newValue: boolean) => void;
  toggleSelectAllWordBanks: (newValue: boolean) => void;
}

function MainMenu({
  selectedGames,
  onToggleGame,
  onStartGame,
  canStart,
  readerIsSelected,
  hasReaderDocument,
  gameLengthSeconds,
  setGameLengthSeconds,
  showSolutionSeconds,
  setShowSolutionSeconds,
  readerLengthSeconds,
  setReaderLengthSeconds,
  readerScrollPixelsPerSecond,
  setReaderScrollPixelsPerSecond,
  readerDocumentName,
  onReaderFileSelected,
  clearReaderFile,
  selectedDifficulties,
  setSelectedDifficulties,
  selectedWordBanks,
  toggleWordBank,
  toggleSelectAllWordBanks,
}: MainMenuProps) {
  const truthyDifficulties = useMemo(() => {
    const keys = Object.keys(selectedGames) as GameName[];
    if (keys.length === 0) return {};
    const truthySelectedGameKeys = keys.filter((key) => selectedGames[key]);
    const truthyDifficulties: Partial<Record<GameName, GameDifficulty>> = {};
    Object.entries(selectedDifficulties).forEach(([key, value]) => {
      const gameName = key as GameName;
      if (truthySelectedGameKeys.includes(gameName) && value && hasDifficulty(gameName)) {
        truthyDifficulties[key as GameName] = value;
      }
    });
    return truthyDifficulties;
  }, [selectedGames, selectedDifficulties]);
  return (
    <Container style={{ marginTop: '2em', paddingBottom: '10em' }}>
      <Grid container spacing={2}>
        <Grid size={12} component='div'>
          <Typography variant="h1" gutterBottom>
            AutoPuzzle
          </Typography>
        </Grid>
        <Grid size={12} component='div'>
          <Typography variant="h3" gutterBottom>
            Pick some shit
          </Typography>
        </Grid>
        <GameSelectionList
          selectedGames={selectedGames}
          onToggleGame={onToggleGame}
        />
        <Settings
          selectedGames={selectedGames}
          gameLengthSeconds={gameLengthSeconds}
          setGameLengthSeconds={setGameLengthSeconds}
          showSolutionSeconds={showSolutionSeconds}
          setShowSolutionSeconds={setShowSolutionSeconds}
          readerLengthSeconds={readerLengthSeconds}
          setReaderLengthSeconds={setReaderLengthSeconds}
          readerScrollPixelsPerSecond={readerScrollPixelsPerSecond}
          setReaderScrollPixelsPerSecond={setReaderScrollPixelsPerSecond}
          readerDocumentName={readerDocumentName}
          onReaderFileSelected={onReaderFileSelected}
          clearReaderFile={clearReaderFile}
          selectedDifficulties={truthyDifficulties}
          setSelectedDifficulties={setSelectedDifficulties}
          selectedWordBanks={selectedWordBanks}
          toggleWordBank={toggleWordBank}
          toggleSelectAllWordBanks={toggleSelectAllWordBanks}
        />
        <Grid size={12} component='div'>
          <Button variant="contained" size='large' disabled={!canStart} onClick={onStartGame}>Start!</Button>
          {readerIsSelected && !hasReaderDocument ? (
            <Typography variant="body2" sx={{ marginTop: 1 }}>
              Upload a text document to include reader mode in rotation.
            </Typography>
          ) : null}
        </Grid>
      </Grid>
    </Container>
  )
};

export default MainMenu;
