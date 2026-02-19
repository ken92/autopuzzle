import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, Grid, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import Title from "./Title";
import { games, type GameName } from "../games";
import { gameDifficulties, type GameDifficulty } from "./types";
import { BANK_LABELS, type WordBankKey } from "./wordBank";

interface SettingsProps {
  selectedGames: Partial<Record<GameName, boolean>>;
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
};

const Settings = ({
  selectedGames,
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
}: SettingsProps) => {
  const handleReaderFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    await onReaderFileSelected(file);
    event.target.value = '';
  };

  return (
    <Grid container size={6} minHeight='30em' alignItems='flex-start' rowSpacing={2}>
      <Grid size={12} component='div'>
        <Title>
          Settings
        </Title>
      </Grid>

      {selectedGames.Reader && (
        <Grid size={12} component='div' alignItems='left' container rowSpacing={2} marginBottom={6}>
          <Grid size={12} component='div'>
            <Typography variant="h5" gutterBottom>
              Reader Settings
            </Typography>
          </Grid>
        <Grid size={12} component='div'>
          <Button variant="outlined" component='label'>
            Upload Text File (PDF autoscrolling does not currently work)
            <input
                type="file"
                hidden
                accept=".txt,.md,text/plain,text/markdown"
                onChange={handleReaderFileChange}
              />
            </Button>
            {readerDocumentName ? (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                Loaded: {readerDocumentName}
              </Typography>
            ) : (
              <Typography variant="body2" sx={{ marginTop: 1 }}>
                No document loaded
              </Typography>
            )}
            {readerDocumentName ? (
              <Button variant="text" color="error" onClick={clearReaderFile}>
                Clear Reader File
              </Button>
            ) : null}
          </Grid>
          <Grid size={12} component='div'>
            <FormControl fullWidth>
              <InputLabel id="reader-length" style={{ color: 'white' }}>Reader Duration</InputLabel>
              <Select
                labelId="reader-length"
                value={readerLengthSeconds}
                onChange={(e) => setReaderLengthSeconds(e.target.value as number)}
                style={{ color: 'white' }}
              >
                <MenuItem value={10}>10 seconds</MenuItem>
                <MenuItem value={30}>30 seconds</MenuItem>
                <MenuItem value={60}>1 minute</MenuItem>
                <MenuItem value={120}>2 minutes</MenuItem>
                <MenuItem value={300}>5 minutes</MenuItem>
                <MenuItem value={600}>10 minutes</MenuItem>
                <MenuItem value={900}>15 minutes</MenuItem>
                <MenuItem value={1200}>20 minutes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12} component='div'>
            <FormControl fullWidth>
              <InputLabel id="reader-scroll-speed" style={{ color: 'white' }}>Reader Auto-Scroll Speed</InputLabel>
              <Select
                labelId="reader-scroll-speed"
                value={readerScrollPixelsPerSecond}
                onChange={(e) => setReaderScrollPixelsPerSecond(e.target.value as number)}
                style={{ color: 'white' }}
              >
                <MenuItem value={10}>Slow (10 px/s)</MenuItem>
                <MenuItem value={20}>Medium (20 px/s)</MenuItem>
                <MenuItem value={40}>Fast (40 px/s)</MenuItem>
                <MenuItem value={80}>Very Fast (80 px/s)</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>)}

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
      <Grid size={12} component='div' alignItems='left'>
        <FormControl fullWidth>
          <InputLabel id="show-solution" style={{ color: 'white' }}>Show Solution Duration</InputLabel>
          <Select
            labelId="show-solution"
            value={showSolutionSeconds}
            onChange={(e) => setShowSolutionSeconds(e.target.value as number)}
            style={{ color: 'white' }}
          >
            <MenuItem value={3}>3 seconds</MenuItem>
            <MenuItem value={10}>10 seconds</MenuItem>
            <MenuItem value={30}>30 seconds</MenuItem>
            <MenuItem value={60}>1 minute</MenuItem>
            <MenuItem value={120}>2 minutes</MenuItem>
            <MenuItem value={300}>5 minutes</MenuItem>
            <MenuItem value={600}>10 minutes</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Grid size={12} component='div' alignItems='left' container>
        <Grid size={12} component='div'>
          <Typography variant="h6" gutterBottom>
            Word Bank Packs
          </Typography>
        </Grid>
        <Grid size={12} component='div'>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={[...selectedWordBanks].length === BANK_LABELS.length}
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleSelectAllWordBanks(event.target.checked)}
                />
              }
              label='Select All'
            />
            {BANK_LABELS.map((label) => (
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedWordBanks.has(label as WordBankKey)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => toggleWordBank(label as WordBankKey, event.target.checked)}
                  />
                }
                label={label}
                key={label}
              />
            ))}
          </FormGroup>
        </Grid>
      </Grid>

      <Grid container size={12} component='div' minHeight={'15em'} rowSpacing={3}>
        {(Object.keys(selectedDifficulties) as GameName[]).map((gameName) => (
          <Grid size={12} component='div' alignItems='left' key={gameName}>
            <FormControl fullWidth>
              <InputLabel id={`difficulty-${gameName}`} style={{ color: 'white' }}>{games[gameName].label} Difficulty</InputLabel>
              <Select
                labelId={`difficulty-${gameName}`}
                value={selectedDifficulties[gameName] || 'hard'}
                onChange={(e) => setSelectedDifficulties({ ...selectedDifficulties, [gameName]: e.target.value as GameDifficulty })}
                style={{ color: 'white' }}
              >
                {gameDifficulties.map(difficulty => (
                  <MenuItem key={difficulty} value={difficulty}>{difficulty}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default Settings;
