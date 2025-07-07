import { Response } from "express"

export default abstract class AbstractController {
    
    protected internalError(response: Response, message?: string): void{
        response.status(500);
        response.json({ error: message != undefined ? message : 'internal server error' });
        response.end();

    }

    protected badRequestError(response: Response, message?: string): void {
        response.status(400);
        response.json({ error: message != undefined ? message : 'client side error' });
        response.end();
    }

    protected notFoundError(response: Response, message?: string): void {
        response.status(404);
        response.json({ error: message != undefined ? message : 'resource not found' });
        response.end();    
    }

    protected correctRequest(response: Response, body: any): void {
        response.status(200);
        response.json(body);
        response.end();
    }
}