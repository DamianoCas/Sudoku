import { useState } from "react";
import styles from '../styles/user.module.css';
import { type AlertData } from "./Alert";


export interface UserType {
    id: number;
    userName: string;
    eMail: string;
    passwordHash: string;
    salt: string;
    userGames: any[];
}

interface LoginCredentials {
    eMail:string;
    password: string;
}

interface RegisterCredentials {
    userName: string,
    eMail: string,
    password: string
}

export const LoginState = {
    EmptyPage: 1,
    Login: 2,
    Register: 3,
} as const;

export type LoginState = (typeof LoginState)[keyof typeof LoginState];

interface UserProp {
    onUserChange: (user: UserType | null) => void;
    onAlertUse: (alertData: AlertData) => void;
    user: UserType | null;
}


export default function User( {onUserChange, onAlertUse, user}: UserProp) {
    const [loginState, setLoginState] = useState<LoginState>(LoginState.EmptyPage);
    
    const handleLogin = () => {
        setLoginState(LoginState.Login);
    }
    
    const handleRegister = () => {
        setLoginState(LoginState.Register);
    }
    
    function ifNotLoggedIn (){
        return (
            <div >
            <h1>You are not logged in:</h1>
            <hr />
            <button onClick={handleLogin}>Login</button>
            <button onClick={handleRegister}>Register</button>
            </div>
        );
    }
    
    function loginHTML () {
        return (
            <form id="loginForm">
            <h1>Login with your credentials!</h1>
            <input type="text" placeholder="Your E-mail" id="email" name="email"/>
            <input type="password" placeholder="Your Password" id="password" name="password"/>
            <button onClick={login}>Try connection</button>
            </form>
        );
    }
    
    async function login (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const form = document.getElementById("loginForm")! as HTMLFormElement;
        
        const formData: LoginCredentials = {
            eMail: form.email.value,
            password: form.password.value
        }

        const user = await loginUserDB(formData);

        if (user) onUserChange(user);
    }
    
    async function loginUserDB(userData: LoginCredentials) {
        try {
            const response = await fetch('/api/validateUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
                onAlertUse({
                    message: errorMessage,
                    type: 'error',
                    showAlert: true
                });
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error posting user data:', error);
        }
    }
    
    function registerHTML () {
        return (
            <form id="registerForm">
                <h1>Login with your credentials!</h1>
                <input type="text" placeholder="Your UserName" id="userName" name="userName"/>
                <input type="text" placeholder="Your E-mail" id="email" name="email"/>
                <input type="password" placeholder="Your Password" id="password" name="password"/>
                <input type="password" placeholder="Repeat Your Password" id="repeatPassword" name="repeatPassword"/>
                <button onClick={register}>Try connection</button>
            </form>
        );
    }

    async function register (event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();
        const form = document.getElementById("registerForm")! as HTMLFormElement;

        if (form.password.value !== form.repeatPassword.value) {
            onAlertUse({
                message: "The two passwords are different!",
                type: 'error',
                showAlert: true
            });
            return;
        }

        const formData: RegisterCredentials = {
            userName: form.userName.value,
            eMail: form.email.value,
            password: form.password.value,
        }

        const user = await registerUserDB(formData);

        if (user) onUserChange(user);
    }

    async function registerUserDB(userData: LoginCredentials) {
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;
                onAlertUse({
                    message: errorMessage,
                    type: 'error',
                    showAlert: true
                });
                return null;
            }
            
            return await response.json();
        } catch (error) {
            console.error('Error posting user data:', error);
        }
    }


    
    function ifLoggedIn () {
        return (
            <div>
                <h1>Hello {user?.userName}!</h1>
                <hr />
                <button onClick={logout}>Logout</button>
            </div>
        )
    }

    function logout () {
        onUserChange(null);
        setLoginState(LoginState.EmptyPage);
    }
    
    return (
        <div className={styles.login}>
        {
            !user ? 
            loginState == LoginState.EmptyPage ? ifNotLoggedIn()
            : loginState == LoginState.Login ? loginHTML()
            : registerHTML()
            : ifLoggedIn()
        }
        </div>
    );
}