import { useEffect, useState } from 'react';
import styles from '../styles/leaderBoard.module.css';
import type { sudokuSpecifics } from './SudokuBoard';


export default function LeaderBoard() {
    const [chosenBoard, setchosenBoard] = useState<sudokuSpecifics | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                (document.getElementById("idBoard")! as HTMLInputElement).value = "289";
                const data = await getBoardFromDB(289);
                setchosenBoard(data);
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

        const data = await getBoardFromDB(+idBoard);
        setchosenBoard(data);
    }


    return <div>
        <div className={styles.boardSelction}>
            <label htmlFor="idBoard">ID Sudoku Board:</label>
            <input type="number" placeholder='ID Sudoku Board' onChange={handleIdChange} id='idBoard'/>
        </div>
        {
            chosenBoard !== null ? (<div style={{ display: "flex", justifyContent: "space-between", alignSelf: "center"}} >
                <h1>Id: {chosenBoard?.id}</h1>
                <h1>Difficulty: {chosenBoard?.difficulty}</h1>
                <h1>Total Games: </h1>
            </div>) : ""
        }
        
    </div>
}
