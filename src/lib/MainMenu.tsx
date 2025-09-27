import GameSelectionList from './GameSelectionList';
import type { GameName } from '../games';
import { Button, Container, Grid, Typography } from '@mui/material';

interface MainMenuProps {
  selectedGames: Partial<Record<GameName, boolean>>;
  onToggleGame: (game: GameName) => void;
  onStartGame: () => void;
}

function MainMenu({ selectedGames, onToggleGame, onStartGame }: MainMenuProps) {
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
        <Grid size={12} component='div'>
          <Button variant="contained" size='large' onClick={onStartGame}>Start!</Button>
        </Grid>
      </Grid>
    </Container>
  )
};

export default MainMenu;
