import { useState } from "react";
import Header from "./components/Header";
import GameComponent from "./components/GameComponent";
import User, { type UserType } from "./components/UserComponent";
import Alert, {type AlertData} from "./components/Alert";
import LeaderBoard from "./components/LeaderBoard";


export const PageState = {
  User: 1,
  Game: 2,
  Leader: 3,
} as const;

export type PageState = (typeof PageState)[keyof typeof PageState];


function App() {
  const [pageState, setPageState] = useState<PageState>(PageState.Game);
  const [user, setUser] = useState<UserType | null>(null);
  const [alertData, setAlertData] = useState<AlertData>({
    message: '',
    type: 'success',
    showAlert: false
  });

  const handleUserPage = () => { setPageState(PageState.User) }
  const handleGamePage = () => { setPageState(PageState.Game) }
  const handleLeaderBoardPage = () => { setPageState(PageState.Leader) }

  const handleUserChange = (newUser: UserType | null) => { setUser(newUser) }

  
  return (
    <div>
      <div>
        <Header onUserSelection={handleUserPage} onGameSelection={handleGamePage} onLeaderBoardSelection={handleLeaderBoardPage}/>
      </div>
      <main>
        {
          pageState == PageState.User ?  <User onUserChange={handleUserChange} onAlertUse={setAlertData} user={user}/>
          : pageState == PageState.Game ? <GameComponent onAlertUse={setAlertData} user={user}/>
          : <LeaderBoard />
        }
      </main>
      <div>
        {alertData.showAlert && (
          <Alert 
            message={alertData.message} 
            type={alertData.type} 
            onClose={() => setAlertData({
              message: '',
              type: 'success',
              showAlert: false
            })}
          />
        )}
      </div>
    </div>
    
  )
}

export default App
