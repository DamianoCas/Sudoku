import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express"
import { SudokuBoard } from "../entity/SudokuBoard";
import AbstractController from "./AbstractController";


export class SudokuBoardController extends AbstractController {

    private sudokuBoardRepository = AppDataSource.getRepository(SudokuBoard);

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.id);
            const sudokuBoard = await this.sudokuBoardRepository.findOne({ where: { id } });

            if (!sudokuBoard) return "Sudoku Board not present!";
            return sudokuBoard;
        } catch (error) {
            this.internalError(response, error.message);
        }
        
    }
}