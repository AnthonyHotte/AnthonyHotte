import { DatabaseService } from '@app/services/database.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

// const HTTP_STATUS_CREATED = 201;
// const HTTP_STATUS_OK = 200;
@Service()
export class DatabaseController {
    router: Router;

    constructor(private databaseService: DatabaseService) {
        this.configureRouter();
    }

    private configureRouter(): void {
        this.router = Router();

        /**
         * @swagger
         *
         * /api/dictionary:
         *   get:
         *     description: Return dictionary info
         *     tags:
         *       - Dictionary
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *
         */
        this.router.get('/jvnames', (req: Request, res: Response) => {
            // Send the request to the service and send the response
            // const nameJv = [];
            // this.databaseService.database.collection('JVName');
            res.json(this.databaseService.database.collection('JVName'));
        });
    }
}
