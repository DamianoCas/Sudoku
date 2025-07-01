import { Response } from "express"

export default abstract class AbstractController {
    
    protected internalError(response: Response, message?: string): void{
        response.status(500);
        response.json({ error: message != undefined ? message : 'internal server error' });
    }

    protected badRequestError(response: Response, message?: string): void {
        response.status(401);
        response.json({ error: message != undefined ? message : 'client sied error' });
    }

    protected notFoundError(response: Response, message?: string): void {
        response.status(404);
        response.json({ error: message != undefined ? message : 'resource not found' });
    }
}