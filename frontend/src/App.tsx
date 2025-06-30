import { useEffect, useState } from "react";
import { type sudokuSpecifics } from "./components/SudokuBoard"
import {type TimerState as State, TimerState} from "./components/Timer"
import Header from "./components/Header";
import GameComponent from "./components/GameComponent";
import User, { type UserType } from "./components/UserComponent";

export const PageState = {
  User: 1,
  Game: 2,
  Leader: 3,
} as const;

export type PageState = (typeof PageState)[keyof typeof PageState];


function App() {
  const [boardSpecifics, setBoardSpecifics] = useState<sudokuSpecifics | null>(null);
  const [timerRunning, setTimerRunning] = useState<State>(TimerState.Stop);
  const [pageState, setPageState] = useState<PageState>(PageState.Game);
  const [user, setUser] = useState<UserType | null>(null);

  const handleStartTimer = () => { setTimerRunning(TimerState.Start) }
  const handleStopTimer = () => { setTimerRunning(TimerState.Stop) }
  const handleResetTimer = () => { setTimerRunning(TimerState.Reset) }

  const handleUserPage = () => { setPageState(PageState.User) }
  const handleGamePage = () => { setPageState(PageState.Game) }
  const handleLeaderBoardPage = () => { setPageState(PageState.Leader) }

  const handleUserChange = (newUser: UserType | null) => { setUser(newUser) }

  
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
      <div>
        <Header onUserSelection={handleUserPage} onGameSelection={handleGamePage} onLeaderBoardSelection={handleLeaderBoardPage}/>
      </div>
      <main>
        {
          pageState == PageState.User ?  <User onUserChange={handleUserChange} user={user}/>
          : pageState == PageState.Game ? <GameComponent 
            boardSpecifics={boardSpecifics}
            timerRunning={timerRunning}
            handleStartTimer={handleStartTimer}
            handleStopTimer={handleStopTimer}
            handleResetTimer={handleResetTimer}
            handleNewBoard={handleNewBoard} />
          : ("leader Board")
        }
      </main>
    </div>
    
  )
}

export default App
