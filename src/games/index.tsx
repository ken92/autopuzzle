import type { ComponentType } from 'react';
import Sudoku from "./Sudoku";
import WordSearch from './WordSearch';

// Central registry of available games -- add new games here!
export const games = {
  Sudoku: { component: Sudoku, label: 'Sudoku' },
  WordSearch: { component: WordSearch, label: 'Word Search' },
} as const;

export type GameName = keyof typeof games;
export const GAME_NAMES = Object.keys(games) as Array<GameName>;

export function getGame(name: GameName): ComponentType | undefined {
	return games[name].component;
}
export const getLabel = (name: GameName) => games[name].label;
