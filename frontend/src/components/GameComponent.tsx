import { useEffect, useState } from "react";
import Timer, {type TimerState as State, TimerState} from "./Timer";
import SudokuBoard, { type endGameType, type sudokuSpecifics } from "./SudokuBoard"
import type { UserType } from "./UserComponent";

interface GameType {
  id?: number;
  easyMode: boolean;
  board: sudokuSpecifics;
}

interface UsersGamesType {
  game: GameType;
  user: UserType;
  time: number;
  completed: boolean;
  errors: number;
  winner: boolean;
}

interface GameProp {
  user: UserType | null;
}

export default function GameComponent ( {user}: GameProp) {
  const [boardSpecifics, setBoardSpecifics] = useState<sudokuSpecifics | null>(null);
  const [timerRunning, setTimerRunning] = useState<State>(TimerState.Stop);
  
  const handleTimerChange = (newTimerState: TimerState) => { setTimerRunning(newTimerState) }
  
  async function handleGameSave (endGame: endGameType) {
    let game: GameType = {
      easyMode: endGame.easy_mode,
      board: boardSpecifics as sudokuSpecifics
    };

    game = await createGame(game); 

    let usersGames: UsersGamesType = {
      game: game,
      user: user as UserType,
      time: 200,
      completed: endGame.completed,
      errors: endGame.errors,
      winner: true
    }

    usersGames = await createUsersGames(usersGames);
  }

  async function createGame (newGame: GameType) {
    try {
      const response = await fetch('/api/game', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGame),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error posting user data:', error);
    }
  }

  async function createUsersGames (newusersGames: UsersGamesType) {
    try {
      const response = await fetch('/api/usersGames', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newusersGames),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error posting user data:', error);
    }
  }
  
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
      <SudokuBoard specifics={boardSpecifics} onTimerChange={handleTimerChange} onGameSave={handleGameSave}/>
    ) : (
      <div>Loading board...</div>
    )}
    </div>
    
    <button onClick={() => handleNewBoard(-1)}>New Board</button>
    </div>
  );
};