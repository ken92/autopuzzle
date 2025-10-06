import { useMemo } from 'react';
import { type GameDifficulty, type GameProps } from '../lib/types';
import { Box, Grid, Typography } from '@mui/material';
import WordSearchBoard from '../lib/WordSearchBoard';
import Timer from '../lib/Timer';
import { getRandomWordsFromBanks, type WordBankKey } from '../lib/wordBank';

type Direction = [number, number];
const DIRECTIONS: Direction[] = [
  [0, 1], // right
  [1, 0], // down
  [0, -1], // left
  [-1, 0], // up
  [1, 1], // down-right
  [1, -1], // down-left
  [-1, 1], // up-right
  [-1, -1], // up-left
];

function emptyGrid(width: number, height: number) {
  return Array.from({ length: height }, () => Array.from({ length: width }, () => '.'));
}

function inBounds(x: number, y: number, width: number, height: number) {
  return x >= 0 && y >= 0 && x < width && y < height;
}

function tryPlaceWord(grid: string[][], word: string, maxAttempts = 3000): boolean {
  const height = grid.length;
  const width = grid[0].length;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const dir = DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)];
    const reversed = Math.random() < 0.5;
    const w = reversed ? word.split('').reverse().join('') : word;
    const startR = Math.floor(Math.random() * height);
    const startC = Math.floor(Math.random() * width);

    // check fits
    let r = startR;
    let c = startC;
    let ok = true;
    for (let i = 0; i < w.length; i++) {
      if (!inBounds(c, r, width, height) || !grid[r] || !grid[r][c]) { ok = false; break; }
      const cur = grid[r][c];
      if (cur !== '.' && cur !== w[i]) { ok = false; break; }
      r += dir[0];
      c += dir[1];
    }
    if (!ok) continue;

    // place
    r = startR;
    c = startC;
    for (let i = 0; i < w.length; i++) {
      grid[r][c] = w[i];
      r += dir[0];
      c += dir[1];
    }
    return true;
  }
  return false;
}

function fillRandomLetters(grid: string[][]) {
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[0].length; c++) {
      if (grid[r][c] === '.') grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
    }
  }
}

interface WordSearchInternalProps extends GameProps {
  wordBanks: Set<WordBankKey>;
}

const difficultyMap: Record<GameDifficulty, { width: number; height: number; numWords: number }> = {
  easy: { width: 15, height: 15, numWords: 10 },
  medium: { width: 30, height: 25, numWords: 15 },
  hard: { width: 30, height: 30, numWords: 20 },
  'very-hard': { width: 40, height: 30, numWords: 30 },
  insane: { width: 50, height: 30, numWords: 45 },
  inhuman: { width: 65, height: 35, numWords: 50 },
};

export default function WordSearch({ difficulty, showSolution, secondsLeft, wordBanks }: WordSearchInternalProps) {
  const { wordsToFind, width, solvedBoard, displayBoard, cellSize } = useMemo(() => {
    const { width, height, numWords } = difficultyMap[difficulty] || difficultyMap.hard;
    const grid = emptyGrid(width, height);
    const wordsToFind: string[] = [];
    const words = getRandomWordsFromBanks(Array.from(wordBanks), numWords);
    for (const raw of words) {
      const w = raw.toUpperCase().replace(/[^A-Z]/g, '');
      if (w.length === 0) continue;
      let ok = tryPlaceWord(grid, w);
      let attemptsLeft = 10;
      while (!ok && attemptsLeft > 0) {
        attemptsLeft--;
        ok = tryPlaceWord(grid, w);
      }
      if (ok) wordsToFind.push(w);
    }

    const solvedBoard = grid.map(r => r.slice());
    const display = grid.map(r => r.slice());
    fillRandomLetters(display);
    const cellSize = Math.max(20, Math.min(60, Math.floor(600 / width)));
    console.log({wordsToFind});
    return { wordsToFind, width, solvedBoard, displayBoard: display, cellSize };
  }, [difficulty]);

  if (!solvedBoard || !displayBoard) return <Typography>Generating...</Typography>;

  const solvedString = solvedBoard.map((r) => r.join('')).join('');
  const displayString = displayBoard.map((r) => r.join('')).join('');

  return (
    <Grid container direction="column" alignItems="center" spacing={1}>
      <WordSearchBoard width={width} board={showSolution ? solvedString : displayString} cellSize={cellSize} />
      <Timer secondsLeft={secondsLeft} />
      <Grid container spacing={0.2}>
        {wordsToFind.map((word) => (
          <Grid key={word}>
            <Box
              sx={(theme) => ({
                padding: '4px 8px',
                color: theme.palette.text.primary,
                backgroundColor: theme.palette.background.paper,
                borderRadius: '4px',
                border: `1px solid ${theme.palette.divider}`,
              })}
            >
              <Typography variant="body1" fontSize={`${Math.floor(wordsToFind.length * 0.4) / 32}rem`}>{word}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}

