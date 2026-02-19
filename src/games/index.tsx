import Sudoku from "./Sudoku";
import WordSearch from './WordSearch';
import Reader from './Reader';

// Central registry of available games -- add new games here!
export const games = {
  Sudoku: { component: Sudoku, label: 'Sudoku', hasDifficulty: true },
  WordSearch: { component: WordSearch, label: 'Word Search', hasDifficulty: true },
  Reader: { component: Reader, label: 'Reader', hasDifficulty: false },
} as const;

export type GameName = keyof typeof games;
export const GAME_NAMES = Object.keys(games) as Array<GameName>;

export function getGame(name: GameName) {
	return games[name].component;
}
export const getLabel = (name: GameName) => games[name].label;
export const hasDifficulty = (name: GameName) => games[name].hasDifficulty;
