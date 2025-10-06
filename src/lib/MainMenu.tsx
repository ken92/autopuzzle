import GameSelectionList from './GameSelectionList';
import type { GameName } from '../games';
import { Button, Container, Grid, Typography } from '@mui/material';
import Settings from './Settings';
import { useMemo } from 'react';
import type { GameDifficulty } from './types';

export interface MainMenuProps {
  selectedGames: Partial<Record<GameName, boolean>>;
  onToggleGame: (game: GameName) => void;
  onStartGame: () => void;
  gameLengthSeconds: number;
  setGameLengthSeconds: (seconds: number) => void;
  showSolutionSeconds: number;
  setShowSolutionSeconds: (seconds: number) => void;
  selectedDifficulties: Partial<Record<GameName, GameDifficulty>>;
  setSelectedDifficulties: (difficulties: Partial<Record<GameName, GameDifficulty>>) => void;
}

function MainMenu({ selectedGames, onToggleGame, onStartGame, gameLengthSeconds, setGameLengthSeconds, showSolutionSeconds, setShowSolutionSeconds, selectedDifficulties, setSelectedDifficulties }: MainMenuProps) {
  const [aGameIsSelected, truthyDifficulties] = useMemo(() => {
    const keys = Object.keys(selectedGames) as GameName[];
    if (keys.length === 0) return [false, {}];
    const truthySelectedGameKeys = keys.filter((key) => selectedGames[key]);
    const truthyDifficulties: Partial<Record<GameName, GameDifficulty>> = {};
    Object.entries(selectedDifficulties).forEach(([key, value]) => {
      if (truthySelectedGameKeys.includes(key as GameName) && value) {
        truthyDifficulties[key as GameName] = value;
      }
    });
    return [truthySelectedGameKeys.length > 0, truthyDifficulties];
  }, [selectedGames, selectedDifficulties]);
  return (
    <Container>
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
          gameLengthSeconds={gameLengthSeconds}
          setGameLengthSeconds={setGameLengthSeconds}
          showSolutionSeconds={showSolutionSeconds}
          setShowSolutionSeconds={setShowSolutionSeconds}
          selectedDifficulties={truthyDifficulties}
          setSelectedDifficulties={setSelectedDifficulties}
        />
        <Grid size={12} component='div'>
          <Button variant="contained" size='large' disabled={!aGameIsSelected} onClick={onStartGame}>Start!</Button>
        </Grid>
      </Grid>
    </Container>
  )
};

export default MainMenu;
