import GameSelectionList from './GameSelectionList';
import type { GameName } from '../games';
import { Button, Container, Grid, Typography } from '@mui/material';
import Settings from './Settings';
import { useMemo } from 'react';

export interface MainMenuProps {
  selectedGames: Partial<Record<GameName, boolean>>;
  onToggleGame: (game: GameName) => void;
  onStartGame: () => void;
  gameLengthSeconds: number;
  setGameLengthSeconds: (seconds: number) => void;
  showSolutionSeconds: number;
  setShowSolutionSeconds: (seconds: number) => void;
}

function MainMenu({ selectedGames, onToggleGame, onStartGame, gameLengthSeconds, setGameLengthSeconds, showSolutionSeconds, setShowSolutionSeconds }: MainMenuProps) {
  const aGameIsSelected = useMemo(() => {
    const keys = Object.keys(selectedGames) as GameName[];
    if (keys.length === 0) return false;
    return keys.some((key) => selectedGames[key]);
  }, [selectedGames]);
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
        />
        <Grid size={12} component='div'>
          <Button variant="contained" size='large' disabled={!aGameIsSelected} onClick={onStartGame}>Start!</Button>
        </Grid>
      </Grid>
    </Container>
  )
};

export default MainMenu;
