import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import AbstractController from "./AbstractController";
import { validate } from 'class-validator';

export class UserController extends AbstractController{

    private userRepository = AppDataSource.getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            return this.userRepository.find();
        } catch (error) {
            this.internalError(response, error.message)
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.id);
            const user = await this.userRepository.findOne({ where: { id } })

            if (!user) return "unregistered user";
            return user
        } catch (error) {
            this.internalError(response, error.message);
        }
        
    }

    async save(request: Request, response: Response, next: NextFunction) {
        try{
            const { userName, eMail, password } = request.body;
            let user = new User();
            user.userName = userName;
            user.eMail = eMail;
            user.passwordHash = password;

            const errors = await validate(user);

            if (errors.length > 0) throw new Error('Validation failed');
            else await this.userRepository.save(this.userRepository.create(user));

            return user;
        } catch (error) {
            this.internalError(response, error.message);
        }
        
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.id)
            let userToRemove = await this.userRepository.findOneBy({ id })

            if (!userToRemove) return "this user not exist";

            await this.userRepository.remove(userToRemove)
            return "user has been removed"
        } catch (error) {
            this.internalError(response, error.message);
        }
        
    }

    async login(request: Request, response: Response, next: NextFunction) {
        try {
            const { eMail, password } = request.body;

            const user = await this.userRepository.findOne({ where: { eMail } })

            if (!user) return "unregistered user";
            if (await user.validatePassword(password)) return user;
            else return "password not correct";
        } catch (error) {
            this.internalError(response, error.message);
        }
    }
}