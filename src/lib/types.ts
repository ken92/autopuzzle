export type GameDifficulty = 'easy' | 'medium' | 'hard' | 'very-hard' | 'insane' | 'inhuman';
export const gameDifficulties: GameDifficulty[] = ['easy', 'medium', 'hard', 'very-hard', 'insane', 'inhuman'];

export interface GameProps {
  difficulty: GameDifficulty;
  showSolution: boolean;
  secondsLeft: number;
}
