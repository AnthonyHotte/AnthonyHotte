import { Message } from '@app/message';
import { TurnService } from '@app/services/turn.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

@Service()
export class TurnController {
    router: Router;

    constructor(private readonly turnService: TurnService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();
        /**
         * @swagger
         *
         * definitions:
         *   Message:
         *     type: object
         *     properties:
         *       title:
         *         type: string
         *       body:
         *         type: string
         */

        /**
         * @swagger
         * tags:
         *   - name: Example
         *     description: Default cadriciel endpoint
         *   - name: Message
         *     description: Messages functions
         */

        /**
         * @swagger
         *
         * /api/example:
         *   get:
         *     description: Return current time with hello world
         *     tags:
         *       - Example
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *         schema:
         *           $ref: '#/definitions/Message'
         *
         */
        this.router.get('/', (req: Request, res: Response) => {
            const str: string = req.query.index as string;
            // Send the request to the service and send the response
            const turn: Message = this.turnService.getTurn(parseInt(str, 10));
            res.json(turn);
        });
    }
}
