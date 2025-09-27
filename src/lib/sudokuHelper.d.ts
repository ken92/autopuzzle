// src/lib/sudokuHelper.d.ts
export type Board = number[][];

// named exports
export function solve(board: Board, reverse?: boolean): Board | false;
export function generate(difficulty?: 'easy' | 'medium' | 'hard' | 'very-hard' | 'insane' | 'inhuman' | number, unique?: boolean): string;
export function get_candidates(board: Board | string): string[][] | false;

// default export (the full sudoku object)
declare const sudokuHelper: {
  solve: typeof solve;
  generate: typeof generate;
  get_candidates: typeof get_candidates;
  // add other functions as needed
};
export default sudokuHelper;
