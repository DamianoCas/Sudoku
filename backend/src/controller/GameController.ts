import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Game } from "../entity/Game";
import AbstractController from "./AbstractController";



export class GameController extends AbstractController {
    private gameRepository = AppDataSource.getRepository(Game);

    async save(request: Request, response: Response, next: NextFunction) {
        if (!request.body.easyMode || !request.body.board){
            return this.badRequestError(response, "body of the request not correct, (easyMode, board)!")
        }
        try {
            const { easyMode, board } = request.body;

            const game = new Game();
            game.board = board;
            game.easyMode = easyMode;

            await this.gameRepository.save(this.gameRepository.create(game));
            return game;
            
        } catch (error) {
            this.internalError(response, error.message)
        }
    } 
}