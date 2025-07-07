import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import AbstractController from "./AbstractController";
import { UsersGames } from "../entity/UsersGames";



export class UsersGamesController extends AbstractController {
    private UsersGamesRepository = AppDataSource.getRepository(UsersGames);

    async save(request: Request, response: Response, next: NextFunction) {
        if (!('game' in request.body) || !('user' in request.body) || !('time' in request.body)
            || !('completed' in request.body) || !('errors' in request.body) || !('winner' in request.body)) {
            return this.badRequestError(response, "body of the request not correct, (game, user, time, completed, errors, winner)!")
        }
        try {
            const { game, user, time, completed, errors, winner } = request.body;

            let usersGames = new UsersGames();
            usersGames.game = game;
            usersGames.user = user;
            usersGames.time = time;
            usersGames.completed = completed;
            usersGames.errors = errors;
            usersGames.winner = winner;

            usersGames = await this.UsersGamesRepository.save(this.UsersGamesRepository.create(usersGames));
            return this.correctRequest(response, usersGames);
            
        } catch (error) {
            this.internalError(response, error.message);
        }
    }
}