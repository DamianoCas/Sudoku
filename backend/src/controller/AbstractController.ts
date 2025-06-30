import { Response } from "express"

export default abstract class AbstractController {
    
    protected internalError(response: Response, message?: string): void{
        response.status(500);
        response.json({ error: message != undefined ? message : 'internal server error' });
    }

    protected clientError(response: Response, message?: string): void {
        response.status(401);
        response.json({ error: message != undefined ? message : 'client sied error' });
    }
}