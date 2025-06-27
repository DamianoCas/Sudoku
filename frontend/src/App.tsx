import { useEffect, useState } from "react";
import SudokuBoard, { type sudokuSpecifics } from "./components/SudokuBoard"


function App() {
  const [boardSpecifics, setBoardSpecifics] = useState<sudokuSpecifics | null>(null);
  
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
    <main>
    <h1>Sudoku</h1>
    <div className="sudoku-container">
    {boardSpecifics ? (
      <SudokuBoard specifics={boardSpecifics} />
    ) : (
      <div>Loading board...</div>
    )}
    </div>
    
    <button onClick={() => handleNewBoard(-1)}>New Board</button>
    </main>
  )
}

export default App
