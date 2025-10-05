import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import Title from "./Title";

interface SettingsProps {
  gameLengthSeconds: number;
  setGameLengthSeconds: (seconds: number) => void;
};

const Settings = ({ gameLengthSeconds, setGameLengthSeconds }: SettingsProps) => {
  return (
    <Grid container spacing={2} size={6}>
      <Grid size={12} component='div'>
        <Title>
          Settings
        </Title>
      </Grid>
      <Grid size={12} component='div' alignItems='left'>
        <FormControl fullWidth>
          <InputLabel id="game-length" style={{ color: 'white' }}>Game Length</InputLabel>
          <Select
            labelId="game-length"
            value={gameLengthSeconds}
            onChange={(e) => setGameLengthSeconds(e.target.value as number)}
            style={{ color: 'white' }}
          >
            <MenuItem value={3}>3 seconds</MenuItem>
            <MenuItem value={30}>30 seconds</MenuItem>
            <MenuItem value={60}>1 minute</MenuItem>
            <MenuItem value={120}>2 minutes</MenuItem>
            <MenuItem value={300}>5 minutes</MenuItem>
            <MenuItem value={600}>10 minutes</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
};

export default Settings;
