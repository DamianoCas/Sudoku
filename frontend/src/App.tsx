import { useState } from "react";
import Header from "./components/Header";
import GameComponent from "./components/GameComponent";
import User, { type UserType } from "./components/UserComponent";
import Alert from "./components/alert";


export const PageState = {
  User: 1,
  Game: 2,
  Leader: 3,
} as const;

export type PageState = (typeof PageState)[keyof typeof PageState];


function App() {
  const [pageState, setPageState] = useState<PageState>(PageState.Game);
  const [user, setUser] = useState<UserType | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'error' | 'success'>('error');

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
          pageState == PageState.User ?  <User onUserChange={handleUserChange} onAlertMessageChange={setAlertMessage} onAlertTypeChange={setAlertType} onShowAlertChange={setShowAlert} user={user}/>
          : pageState == PageState.Game ? <GameComponent user={user}/>
          : ("leader Board")
        }
      </main>
      <div>
        {showAlert && (
          <Alert 
            message={alertMessage} 
            type={alertType} 
            onClose={() => setShowAlert(false)}
          />
        )}
      </div>
    </div>
    
  )
}

export default App
