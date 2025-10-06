import { Box, Typography } from '@mui/material';

interface WordSearchBoardProps {
  board: string;
  width: number;
  cellSize?: number;
}

function boardToGrid(board: string, width: number): string[][] {
  const normalized = board ?? '';
  const cells = normalized.split('');
  const grid: string[][] = [];
  for (let r = 0; r < width; r++) {
    grid.push(cells.slice(r * width, r * width + width));
  }
  return grid;
}

export default function WordSearchBoard({ board, width, cellSize = 60 }: WordSearchBoardProps) {
  const grid = boardToGrid(board, width);
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(' + width + ', ' + cellSize + 'px)',
        gridAutoRows: cellSize + 'px',
        gap: 0,
        color: '#0e1924',
        width: cellSize * width + 'px',
        backgroundColor: '#b9eff0',
        border: '2px solid rgba(0,0,0,0.12)',
        boxSizing: 'content-box',
      }}
    >
      {grid.map((row, r) =>
        row.map((value, c) => {
          return (
            <Box
              key={`${r}-${c}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                userSelect: 'none',
              }}
            >
              <Typography variant="body1" fontSize={Math.floor(cellSize * 0.6) + 'px'}>
                {value === '.' ? '' : value}
              </Typography>
            </Box>
          );
        })
      )}
    </Box>
  );
}
