import { useEffect, useState } from "react";
import "../styles.css";

type SudokuCell = {
  value: string;
  row: number;
  col: number;
  locked: boolean;
  notPossibleValues: number[];
};

export type sudokuSpecifics = {
  id: number;
  puzzle: string;
  solution: string;
  clues: number;
  diffuclty: number;
}

interface SudokuBoardProps {
  specifics: sudokuSpecifics
  
}

export default function SudokuBoard ({specifics}: SudokuBoardProps) {
  const [grid, setGrid] = useState<SudokuCell[][]>([]);

  useEffect(() => {
    let count = 0;
    const newGrid: SudokuCell[][] = [];
    for (let row = 0; row < 9; row++) {
      const newRow: SudokuCell[] = [];
      for (let col = 0; col < 9; col++) {
        const val = specifics.puzzle[count] === "." ? "" : specifics.puzzle[count];
        newRow.push({ value: val, row, col, locked: val !== "", notPossibleValues: [0,0,0,0,0,0,0,0,0] });
        count++;
      }
      newGrid.push(newRow);
    }
    checkPossibilitiesOnGrid(newGrid);
    console.log("hello");
    setGrid(newGrid);
  }, [specifics.puzzle]);

  function checkPossibilitiesOnGrid(grid: SudokuCell[][]) {
    for(let row = 0; row < 9; row++){
      for(let col = 0; col < 9; col++){
        if(!grid[row][col].locked) checkPossibilitiesOnCell(grid, row, col);
      }
    }
  }

  function checkPossibilitiesOnCell(grid: SudokuCell[][], row: number, col:number) {
    const myCell = grid[row][col];

    for(let j = 0; j < 9; j++){
      const toCheck = grid[row][j];
      if(toCheck.value !== "") myCell.notPossibleValues[+toCheck.value - 1]++;
    }

    for(let i = 0; i < 9; i++){
      const toCheck = grid[i][col];
      if(toCheck.value !== "") myCell.notPossibleValues[+toCheck.value - 1]++;
    }

    const rowStart = row - row % 3;
    const colStart = col - col % 3;

    for(let i = 0; i < 3; i++){
      if (rowStart + i != row){
        for(let j = 0; j < 3; j++){
          if (colStart + j != col){
            const toCheck = grid[rowStart + i][colStart + j];
            if(toCheck.value !== "") myCell.notPossibleValues[+toCheck.value - 1]++;
          }
        }
      }
    }
  }

  function modifyEntropy(row: number, col: number, newValue: string, oldValue: string, newGrid: SudokuCell[][]){
    const ifSub: boolean = oldValue !== "";
    const ifAdd: boolean = newValue !== "";

    const oldValNum = ifSub ? +oldValue -1 : 0;
    const newValNum = ifAdd ? +newValue -1 : 0;

    for(let j = 0; j < 9; j++){
      const toCheck = newGrid[row][j];
      if(j != col){
        if (ifAdd) toCheck.notPossibleValues[newValNum]++;
        if (ifSub) toCheck.notPossibleValues[oldValNum]--;
      }
    }

    for(let i = 0; i < 9; i++){
      const toCheck = newGrid[i][col];
      if(i != row){
        if (ifAdd) toCheck.notPossibleValues[newValNum]++;
        if (ifSub) toCheck.notPossibleValues[oldValNum]--;
      }
    }

    const rowStart = row - row % 3;
    const colStart = col - col % 3;

    for(let i = 0; i < 3; i++){
      if (rowStart + i != row){
        for(let j = 0; j < 3; j++){
          if (colStart + j != col){
            const toCheck = newGrid[rowStart + i][colStart + j];
            if (ifAdd) toCheck.notPossibleValues[newValNum]++;
            if (ifSub) toCheck.notPossibleValues[oldValNum]--;
          }
        }
      }
    }
  }

  function lowestEntropy(newGrid: SudokuCell[][]): SudokuCell[]{
    let res: SudokuCell[] = [];
    let lowestEntropyNow = 9;

    if (newGrid === undefined || !newGrid.length){
      return res;
    }

    for (let row = 0; row < 9; row++){
      for (let col = 0; col < 9; col ++){
        const toCheck = newGrid[row][col];
        if(!toCheck.locked && toCheck.value == ""){
          const entropy = toCheck.notPossibleValues.filter(item => item === 0).length;

          if(entropy === lowestEntropyNow)
            res.push(toCheck);
          else if (entropy < lowestEntropyNow){
            res = [toCheck];
            lowestEntropyNow = entropy
          }
        }
      }
    }

    return res;
  }

  function handleCellChange(row: number, col: number, newValue: string) {
    const newGrid = [...grid];
    const changedCell = newGrid[row][col];

    modifyEntropy(row, col, newValue, changedCell.value, newGrid);
    changedCell.value = newValue.slice(0, 1); 

    setGrid(newGrid);
  };
  function showPosValues(row: number, col: number){
    console.log(row+1, col+1, grid[row][col].notPossibleValues);
  }

  return (
    <div>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => 
          row.map((cell, colIndex) => (
            <div key={`${rowIndex}-${colIndex}`} 
              className={`sudoku-cell ${rowIndex === 2 || rowIndex === 5 ? "sudoku-row " : ""} 
              ${!(cell.value === "" || cell.notPossibleValues[+cell.value - 1] === 0) ? "wrong": ""}`}>

              <input
                type="number"
                min="1"
                max="9"
                value={cell.value}
                onClick={() => showPosValues(rowIndex, colIndex)}
                onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                disabled = {cell.locked}
              />
            </div>
          ))
        )}
      </div>
      <div>
        {lowestEntropy(grid).map((cell, index) => (
          <div key={index} style={{fontSize: '20px'}}>
            row: {cell.row+1}, col: {cell.col+1}, possible values: [
            {cell.notPossibleValues.reduce((acc: number[], num, index) => {
              if (num === 0) acc.push(index+1);
              return acc;
            }, []).join(' or ')}]
          </div>
        ))}
      </div>
    </div>
  );
};