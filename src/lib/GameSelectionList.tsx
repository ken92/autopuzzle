import { alpha, Box, Grid, styled } from "@mui/material";
import { GAME_NAMES, getLabel, type GameName } from "../games";
import Title from "./Title";

const GameCard = styled(Box, { shouldForwardProp: (prop) => prop !== 'selected' })<{
  selected: boolean;
}>(({ selected }) => ({
  border: '1px solid',
  borderColor: selected ? '#51aef0' : '#bdbdbd',
  backgroundColor: selected ? alpha('#7a9196', 0.4) : 'transparent',
  borderRadius: '1em',
  padding: '1em',
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  '&:hover': {
    borderColor: '#42d1f5',
  },
}));

interface GameSelectionListProps {
  selectedGames: Partial<Record<GameName, boolean>>;
  onToggleGame: (game: GameName) => void;
};

const GameSelectionList = ({ selectedGames, onToggleGame }: GameSelectionListProps) => {
  return (
    <Grid container spacing={2} size={6} alignItems='left'>
      <Grid size={12} component='div'>
        <Title>
          Game Options
        </Title>
      </Grid>
      {GAME_NAMES.map((gameName) => (
        <Grid size='auto' key={gameName} component='div'>
          <GameCard onClick={() => onToggleGame(gameName)} selected={Boolean(selectedGames[gameName])}>
            {getLabel(gameName)}
          </GameCard>
        </Grid>
      ))}
    </Grid>
  );
};

export default GameSelectionList;
