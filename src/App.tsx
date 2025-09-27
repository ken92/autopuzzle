import { useState, type ComponentType } from 'react'
import './App.css'
import { getGame, type GameName } from './games';
import { Container } from '@mui/material';
import MainMenu from './lib/MainMenu';

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
  const [currentGameName, setCurrentGameName] = useState<GameName | null>(null);

  const handleStartGame = () => {
    const game = getRandomGameName(Object.keys(selectedGames).filter((game) => selectedGames[game as GameName]) as GameName[]);
    if (game) {
      setCurrentGameName(game);
      setGameState(GameState.IN_GAME);
    }
  };

  const handleToggleGame = (game: GameName) => {
    setSelectedGames((prev) => ({ ...prev, [game]: !prev[game] }));
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
        console.log({ currentGame: currentGameName });
        if (!currentGameName) return <div>No game selected</div>;
        const GameComponent = getGame(currentGameName);
        return <GameComponent />;
      default:
        return null;
    }
  };

  return (
    <Container>
      {getGameStateComponent()}
    </Container>
  )
}

export default App;
