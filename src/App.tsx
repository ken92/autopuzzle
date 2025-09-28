import { useState } from 'react'
import './App.css'
import { getGame, type GameName } from './games';
import { Box, Container } from '@mui/material';
import MainMenu from './lib/MainMenu';
import type { GameDifficulty } from './lib/types';
import Title from './lib/Title';

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
  const [gameState, setGameState] = useState<GameState>(GameState.MAIN_MENU);
  const [selectedGames, setSelectedGames] = useState<Partial<Record<GameName, boolean>>>({});
  const [selectedDifficulties, setSelectedDifficulties] = useState<Partial<Record<GameName, GameDifficulty>>>({});
  const [currentGameName, setCurrentGameName] = useState<GameName | null>(null);
  const [showSolution, setShowSolution] = useState<boolean>(false);

  const handleStartGame = () => {
    const game = getRandomGameName(Object.keys(selectedGames).filter((game) => selectedGames[game as GameName]) as GameName[]);
    if (game) {
      setCurrentGameName(game);
      setGameState(GameState.IN_GAME);
    }
  };

  const handleToggleGame = (game: GameName) => {
    setSelectedGames((prev) => ({ ...prev, [game]: !prev[game] }));
    setSelectedDifficulties((prev) => ({ ...prev, [game]: prev[game] || 'hard' }));
  };

  const getGameStateComponent = () => {
    switch (gameState) {
      case GameState.MAIN_MENU:
        return (
          <MainMenu
            selectedGames={selectedGames}
            onToggleGame={handleToggleGame}
            onStartGame={handleStartGame}
          />
        );
      case GameState.IN_GAME:
        if (!currentGameName) return <Title>No game selected</Title>;
        const GameComponent = getGame(currentGameName);
        const difficulty = selectedDifficulties[currentGameName] || 'hard';
        return <GameComponent difficulty={difficulty} showSolution={showSolution} />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Box height='80vh'>
        {getGameStateComponent()}
      </Box>
    </Container>
  )
}

export default App;
