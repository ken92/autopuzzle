import { Box, Typography } from '@mui/material';

interface SudokuBoardProps {
  board: string;
  cellSize?: number;
}

function boardToGrid(board: string): string[][] {
  const normalized = board ?? '';
  const cells = normalized.split('');
  const grid: string[][] = [];
  for (let r = 0; r < 9; r++) {
    grid.push(cells.slice(r * 9, r * 9 + 9));
  }
  return grid;
}

export default function SudokuBoard({ board, cellSize = 60 }: SudokuBoardProps) {
  let validGrid = board;
  if (!board || board.length !== 81) {
    validGrid = '.'.repeat(81);
  }
  const grid = boardToGrid(validGrid);

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(9, ' + cellSize + 'px)',
        gridAutoRows: cellSize + 'px',
        gap: 0,
        color: '#0e1924',
        width: cellSize * 9 + 'px',
        backgroundColor: '#b9eff0',
        border: '2px solid rgba(0,0,0,0.12)',
        boxSizing: 'content-box',
      }}
    >
      {grid.map((row, r) =>
        row.map((value, c) => {
          const isBlockRight = (c + 1) % 3 === 0 && c !== 8;
          const isBlockBottom = (r + 1) % 3 === 0 && r !== 8;
          return (
            <Box
              key={`${r}-${c}`}
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRight: isBlockRight ? '3px solid rgba(0,0,0,0.3)' : '2px solid rgba(0,0,0,0.17)',
                borderBottom: isBlockBottom ? '3px solid rgba(0,0,0,0.3)' : '2px solid rgba(0,0,0,0.17)',
                // Add a thin top/left border for first row/col so grid is complete
                borderTop: r === 0 ? '2px solid rgba(0,0,0,0.17)' : undefined,
                borderLeft: c === 0 ? '2px solid rgba(0,0,0,0.17)' : undefined,
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
