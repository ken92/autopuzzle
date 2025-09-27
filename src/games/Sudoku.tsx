import { Grid } from "@mui/material";
import sudokuHelper from "../lib/sudokuHelper.js";

function Sudoku() {
  const test = sudokuHelper.generate("easy");
  console.log({ test });
  return (
    <Grid container component='div'>
      asdfadsasd
    </Grid>
  );
};

export default Sudoku;
