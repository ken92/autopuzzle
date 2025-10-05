import Timer from "../lib/Timer";
import type { GameProps } from "../lib/types";

const WordSearch = ({ difficulty, showSolution, secondsLeft }: GameProps) => {
  return (
    <div>
      <h1>Word Search Game</h1>
      {difficulty && <p>Difficulty: {difficulty}</p>}
      {showSolution && <p>Solution is shown!</p>}
      <Timer secondsLeft={secondsLeft} />
    </div>
  );
};

export default WordSearch;
