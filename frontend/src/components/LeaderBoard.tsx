import { useEffect, useState } from 'react';
import styles from '../styles/leaderBoard.module.css';
import type { sudokuSpecifics } from './SudokuBoard';
import type { AlertData } from './Alert';

interface LeaderBoardProp {
    onAlertUse: (alertData: AlertData) => void;
}


export default function LeaderBoard( {onAlertUse}: LeaderBoardProp) {
    const [chosenBoard, setchosenBoard] = useState<sudokuSpecifics | null>(null);
    const [table, setTable] = useState<any>(null);
    const [count, setCount] = useState<number>(0);


    useEffect(() => {
        const fetchData = async () => {
            try {
                (document.getElementById("idBoard")! as HTMLInputElement).value = "289";
                handleIdChange();
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

    async function handleIdChange() {
        const idBoard = (document.getElementById("idBoard")! as HTMLInputElement).value;

        if (idBoard === "" || +idBoard < 1 || +idBoard > 9999) return;

        const board = await getBoardFromDB(+idBoard);
        setchosenBoard(board);
        const leaderBoard: any[] = await getLeaderBoardDB(board);
        
        setCount(leaderBoard.length)

        setTable( <div className={styles.table_container}>
            <table className={styles.data_table}>
                <thead>
                    <tr>
                        <th>UserName</th>
                        <th>Time</th>
                        <th>Errors</th>
                        <th>Easy Mode</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderBoard.map((row: any) => (
                        <tr>
                            <td>{row.userName}</td>
                            <td>{row.time}</td>
                            <td>{row.errors}</td>
                            <td>{row.easyMode ? "active" : ""}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>);
    }

    async function getLeaderBoardDB(board: sudokuSpecifics) {
        try {
            const response = await fetch('/api/leaderBoard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({board}),
            });
            
            if (response.ok) return await response.json();

            const errorData = await response.json().catch(() => ({}));
            const errorMessage = errorData.error || `HTTP error! status: ${response.status}`;

            onAlertUse({ message: errorMessage, type: 'error', showAlert: true });
            return null;
        } catch (error) {
            console.error('Error posting user data:', error);
        }
    }


    return <div>
        <div className={styles.boardSelection}>
            <label htmlFor="idBoard">ID Sudoku Board:</label>
            <input type="number" placeholder='ID Sudoku Board' onChange={handleIdChange} id='idBoard'/>
        </div>
        {
            chosenBoard !== null ? (<div style={{ display: "flex", justifyContent: "space-between", alignSelf: "center"}} >
                <h1>Id: {chosenBoard?.id}</h1>
                <h1>Difficulty: {chosenBoard?.difficulty}</h1>
                <h1>Total Games: {count}</h1>
            </div>) : ""
        }
        {
            table ? table : ""
        }
        
    </div>
}
