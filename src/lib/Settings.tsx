import { FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import Title from "./Title";

interface SettingsProps {};

const Settings = ({ }: SettingsProps) => {
  return (
    <Grid container spacing={2} size={6}>
      <Grid size={12} component='div'>
        <Title>
          Settings
        </Title>
      </Grid>
      <Grid size={12} component='div' alignItems='left'>
        <FormControl fullWidth>
          <InputLabel id="size-oof" style={{ color: 'white' }}>Size Oof</InputLabel>
          <Select labelId="size-oof" label="Size Oof" style={{ color: 'white' }}>
            <MenuItem value={10}>Tiny Oof</MenuItem>
            <MenuItem value={20}>Small Oof</MenuItem>
            <MenuItem value={30}>Medium Oof</MenuItem>
            <MenuItem value={40}>Large Oof</MenuItem>
            <MenuItem value={50}>BIG OOF</MenuItem>
            <MenuItem value={60}>(Settings coming soon)</MenuItem>
          </Select>
      </FormControl>
      </Grid>
    </Grid>
  );
};

export default Settings;
