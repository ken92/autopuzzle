import { Grid } from "@mui/material";
import sudokuHelper from "../lib/sudokuHelper.js";
import SudokuBoard from "../lib/SudokuBoard.js";
import type { GameProps } from "../lib/types.js";
import { useEffect, useState } from "react";
import Timer from "../lib/Timer.js";

function Sudoku({ difficulty, showSolution, secondsLeft }: GameProps) {
  const [board, setBoard] = useState<string | null>(null);
  const [solvedBoard, setSolvedBoard] = useState<string | null>(null);

  useEffect(() => {
    const { board: newBoard, solvedBoard: newSolvedBoard } = sudokuHelper.generate(difficulty);
    setBoard(newBoard);
    setSolvedBoard(newSolvedBoard);
  }, [difficulty]);

  const showBoard = showSolution && solvedBoard ? solvedBoard : board || '';
  return (
    <Grid container component='div'>
      <SudokuBoard board={showBoard} />
      <Timer secondsLeft={secondsLeft} />
    </Grid>
  );
};

export default Sudoku;
