import  express from "express"
import * as bodyParser from "body-parser"
import { Request, Response } from "express"
import { AppDataSource } from "./data-source"
import { Routes } from "./routes"
import { User } from "./entity/User"
import { SudokuBoard } from "./entity/SudokuBoard"
import { readFile } from "fs/promises"
import cors from "cors";

AppDataSource.initialize().then(async () => {
    
    const app = express();
    app.use(cors({
        origin: [
            'http://localhost:5173',
            'http://frontend:5173'
        ]
    }));
    
    Routes.forEach(route => {
        (app as any)[route.method](route.route, (req: Request, res: Response, next: Function) => {
            const result = (new (route.controller as any))[route.action](req, res, next)
            if (result instanceof Promise) {
                result.then(result => result !== null && result !== undefined ? res.send(result) : undefined);
                
            } else if (result !== null && result !== undefined) {
                res.json(result);
            }
        })
    });

    //TO-DO
    //result !== null && result !== undefined => !result
    //rename file to app.ts
    //fare ad hoc
    
    //insertUsers();
    insertSudokuBoards();
    
    app.listen(3000);
    
    
    console.log("Express server has started on port 3000. Open http://localhost:3000/users to see results");
    
}).catch(error => console.error(error))


async function insertUsers() {
    await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(User)
    .where("1 = 1")
    .execute();
    
    // insert new users for test
    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            userName: "Kuroi",
            eMail: "franco@gmail.com",
            passwordHash: "password123"
        })
    );
    
    await AppDataSource.manager.save(
        AppDataSource.manager.create(User, {
            userName: "PieroUbaldo",
            eMail: "mimmo@gmail.com",
            passwordHash: "password..123"
        })
    );
}

async function insertSudokuBoards() {
    await AppDataSource
    .createQueryBuilder()
    .delete()
    .from(SudokuBoard)
    .where("1 = 1")
    .execute();
    
    try{
        const csvContent = await readFile('./src/assets/sudoku-3m.csv', 'utf-8');
        const lines:string[] = csvContent.split('\n').filter(line => line.trim() !== '');
        
        if (!lines.length) throw new Error('CSV content is empty');
        
        const allSudokus: SudokuBoard[] = [];
        lines.forEach((line: string) => {
            const sudokuString = line.split(",", 5);
            
            const newSudokuBoard:SudokuBoard = {
                id: +sudokuString[0],
                puzzle: sudokuString[1],
                solution: sudokuString[2],
                clues: +sudokuString[3],
                difficulty: +sudokuString[4],
                games: []
            }

            allSudokus.push(newSudokuBoard);
        });
        
        await AppDataSource
            .createQueryBuilder()
            .insert()
            .into(SudokuBoard)
            .values(allSudokus)
            .execute();
        

    } catch(error) {
        console.error(error);
    }
}
