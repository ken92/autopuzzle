import { Grid, Typography } from '@mui/material';

interface TimerProps {
  secondsLeft: number;
}

const formattedTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

function Timer({ secondsLeft }: TimerProps) {
  return (
    <Grid size={12} component='div'>
      <Typography variant="body1">
        Time remaining: {formattedTime(secondsLeft)}
      </Typography>
    </Grid>
  );
};

export default Timer;
