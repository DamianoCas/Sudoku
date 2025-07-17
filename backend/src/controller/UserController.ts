import { AppDataSource } from "../data-source"
import { NextFunction, Request, Response } from "express"
import { User } from "../entity/User"
import AbstractController from "./AbstractController";
import { validate } from 'class-validator';

export class UserController extends AbstractController{

    private userRepository = AppDataSource.getRepository(User);

    async all(request: Request, response: Response, next: NextFunction) {
        try {
            const users = await this.userRepository.find();
            return this.correctRequest(response, users);
        } catch (error) {
            this.internalError(response, error.message)
        }
    }

    async one(request: Request, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.id);
            const user = await this.userRepository.findOne({ where: { id } })

            if (!user) return this.notFoundError(response, "unregistered user");
            return this.correctRequest(response, user);
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

            if (errors.length > 0) return this.badRequestError(response, "validation error");
            else user = await this.userRepository.save(this.userRepository.create(user));

            return this.correctRequest(response, user);
        } catch (error) {
            this.internalError(response, error.message);
        }
        
    }

    async remove(request: Request, response: Response, next: NextFunction) {
        try {
            const id = parseInt(request.params.id)
            let userToRemove = await this.userRepository.findOneBy({ id })

            if (!userToRemove) return this.notFoundError(response, "this user does not exist");

            await this.userRepository.remove(userToRemove)
            return this.correctRequest(response, { message: "user has been removed"});
        } catch (error) {
            this.internalError(response, error.message);
        }
        
    }

    async login(request: Request, response: Response, next: NextFunction) {
        if(!request.body.eMail || !request.body.password){
            return this.badRequestError(response, "body of the request not correct, (eMail, password)!")
        }
        try {
            const { eMail, password } = request.body;

            const user = await this.userRepository.findOne({ where: { eMail } })

            if (!user) {
                return this.notFoundError(response, "unregistered user");
            } 
            if (await user.validatePassword(password)) return this.correctRequest(response, user);
            
            this.badRequestError(response, "password not correct");
        } catch (error) {
            this.internalError(response, error.message);
        }
    }
}