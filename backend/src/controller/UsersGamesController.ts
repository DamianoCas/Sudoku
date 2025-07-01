import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import AbstractController from "./AbstractController";
import { UsersGames } from "../entity/UsersGames";



export class UsersGamesController extends AbstractController {
    private UsersGamesRepository = AppDataSource.getRepository(UsersGames);

    async save(request: Request, response: Response, next: NextFunction) {
        if (!request.body.game || !request.body.user || !request.body.time
            || !request.body.completed || !request.body.errors || !request.body.winner) {

            return this.badRequestError(response, "body of the request not correct, (game, user, time, completed, errors, winner)!")
        }
        try {
            const { game, user, time, completed, errors, winner } = request.body;

            const usersGames = new UsersGames();
            usersGames.game = game;
            usersGames.user = user;
            usersGames.time = time;
            usersGames.completed = completed;
            usersGames.errors = errors;
            usersGames.winner = winner;

            return this.UsersGamesRepository.save(this.UsersGamesRepository.create(usersGames));
            
        } catch (error) {
            this.internalError(response, error.message);
        }
    }
}