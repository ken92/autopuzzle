import { Typography } from '@mui/material';

interface TitleProps {
  children: string;
}

function Title({ children }: TitleProps) {
  return (
    <Typography variant="h6" gutterBottom>
      {children}
    </Typography>
  )
};

export default Title;
