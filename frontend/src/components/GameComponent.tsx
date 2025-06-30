import SudokuBoard, { type sudokuSpecifics } from "./SudokuBoard"
import Timer, {type TimerState as State, TimerState} from "./Timer"


interface GameProps {
  boardSpecifics?: sudokuSpecifics | null;
  timerRunning: TimerState;
  handleStartTimer: () => void;
  handleStopTimer: () => void;
  handleResetTimer: () => void;
  handleNewBoard: (difficulty: number) => void;
}

export default function GameComponent ({
  boardSpecifics,
  timerRunning,
  handleStartTimer,
  handleStopTimer,
  handleResetTimer,
  handleNewBoard
}: GameProps) {
  return (
    <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignSelf: "center"}} >
            <h1>Id: {boardSpecifics?.id}</h1>
            <Timer timerRunning={timerRunning}/>
            <h1>Difficulty: {boardSpecifics?.difficulty}</h1>
        </div>
        
        <div className="sudoku-container">
        {boardSpecifics ? (
            <SudokuBoard specifics={boardSpecifics} onStartTimer={handleStartTimer} onStopTimer={handleStopTimer} onResetTimer={handleResetTimer}/>
        ) : (
            <div>Loading board...</div>
        )}
        </div>
        
        <button onClick={() => handleNewBoard(-1)}>New Board</button>
    </div>
  );
};