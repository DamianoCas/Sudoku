import { useState } from "react";
import SudokuBoard, { type sudokuSpecifics } from "./components/SudokuBoard"


function App() {
  const [boardSpecifics, setBoardSpecifics] = useState<sudokuSpecifics>({
    id: 0,
    puzzle: "",
    solution: "",
    clues: 0,
    diffuclty: 0
  })

  // handleNewBoard(false)
  
  async function getLineFromCSVContent(csvContent: string, index: number): Promise<string> {
    const lines = csvContent.split('\n').filter(line => line.trim() !== '');
    
    if (lines.length === 0) {
      throw new Error('CSV content is empty');
    }
    
    return lines[index];
  }
  
  
  function handleNewBoard(isRandom: boolean) {
    let index = 0;
    if (isRandom)
      index = Math.floor(Math.random() * (999))+1;
    else
      index = 288;
    
    fetch('./src/assets/sudoku-3m.csv')
    .then(response => response.text())
    .then(csvContent => getLineFromCSVContent(csvContent, index))
    .then(randomLine => {
      const randomSudoku = randomLine.split(",", 5);
      
      const newBoardSpecifics = {
        id: +randomSudoku[0],
        puzzle: randomSudoku[1],
        solution: randomSudoku[2],
        clues: +randomSudoku[3],
        diffuclty: +randomSudoku[4]
      }
      
      setBoardSpecifics(newBoardSpecifics);
    })
    .catch(console.error);
  }
  
  
  
  
  
  return (
    <main>
    <h1>Sudoku</h1>
    <div className="sudoku-container">
    <SudokuBoard specifics={boardSpecifics}/>
    </div>
    
    <button onClick={() => handleNewBoard(true)}>New Board</button>
    </main>
  )
}

export default App
