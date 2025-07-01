import { useEffect, useState } from "react";
import Timer, {type TimerState as State, TimerState} from "./Timer";
import SudokuBoard, { type sudokuSpecifics } from "./SudokuBoard"
import type { UserType } from "./UserComponent";

export interface GameType {
  id: number;
  easyMode: boolean;
  board: sudokuSpecifics;
}

interface GameProp {
  user: UserType | null;
  handleUserChange: (newUser: UserType | null) => void;
}

export default function GameComponent ( {user, handleUserChange}: GameProp) {
  const [boardSpecifics, setBoardSpecifics] = useState<sudokuSpecifics | null>(null);
  
  const [timerRunning, setTimerRunning] = useState<State>(TimerState.Stop);
  const [game, setGame] = useState<GameType | null>(null);
  
  const handleStartTimer = () => { setTimerRunning(TimerState.Start) }
  const handleStopTimer = () => { setTimerRunning(TimerState.Stop) }
  const handleResetTimer = () => { setTimerRunning(TimerState.Reset) }
  
  const handleGameChange = (newGame: GameType | null) => { setGame(newGame) }
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBoardFromDB(289);
        setBoardSpecifics(data);
      } catch (err) {
        console.error(err);
      } 
    };
    
    fetchData();
  }, []);
  
  async function getBoardFromDB(index: number): Promise<sudokuSpecifics> {
    try {
      const response = await fetch(`/api/sudokuBoard/${index}`);
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  
  async function handleNewBoard(index: number) {
    if (index === -1) index = Math.floor(Math.random() * (999))+1;
    
    const board = await getBoardFromDB(index);
    setBoardSpecifics(board);
  }
  
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