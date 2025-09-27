import { useState } from 'react'
import './App.css'
import GameSelectionList from './lib/GameSelectionList';
import type { GameName } from './games';
import { Button, Container, Grid, Typography } from '@mui/material';

function App() {
  const [selectedGames, setSelectedGames] = useState<Partial<Record<GameName, boolean>>>({});

  const handleToggleGame = (game: GameName) => {
    setSelectedGames((prev) => ({ ...prev, [game]: !prev[game] }));
  };

  return (
    <Container>
      <Grid container spacing={2}>
        <Grid size={12}>
          <Typography variant="h1" gutterBottom>
            AutoPuzzle
          </Typography>
        </Grid>
        <Grid size={12}>
          <Typography variant="h3" gutterBottom>
            Pick some shit
          </Typography>
        </Grid>
        <GameSelectionList
          selectedGames={selectedGames}
          onToggleGame={handleToggleGame}
        />
        <Grid size={12}>
          <Button variant="contained" size='large'>Start!</Button>
        </Grid>
      </Grid>
    </Container>
  )
}

export default App
