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
        const HTTP_OK_STATUS = 200;

        /**
         * @swagger
         *
         * /api/database/jveasynames:
         *   get:
         *     description: Return names jvEasy
         *     produces:
         *       - string[]
         *     responses:
         *       200:
         *
         */
        this.router.get('/jveasynames', async (req: Request, res: Response) => {
            // Send the request to the service and send the response
            const nameJv: string[] = [];
            await this.databaseService.database
                .collection('JVEasyName')
                .find()
                .forEach((document) => {
                    nameJv.push(document.name);
                });

            res.json(nameJv);
        });
        /**
         * @swagger
         *
         * /api/database/jvhardnames:
         *   get:
         *     description: Return names jvHard
         *     produces:
         *       - string[]
         *     responses:
         *       200:
         *
         */
        this.router.get('/jvhardnames', async (req: Request, res: Response) => {
            // Send the request to the service and send the response
            const nameJv: string[] = [];
            await this.databaseService.database
                .collection('JVHardName')
                .find()
                .forEach((document) => {
                    nameJv.push(document.name);
                });

            res.json(nameJv);
        });
        /**
         * @swagger
         *
         * /api/database/sendnameschanges:
         *   get:
         *     description: change Jv names
         *     responses:
         *       200:
         *
         */
        this.router.post('/sendnameschanges', async (req: Request, res: Response) => {
            const modeJV = req.body.jvLevel;
            const nameCollection = ['JVEasyName', 'JVHardName'];
            this.databaseService.database.collection(nameCollection[modeJV]).deleteMany({});
            for (const nameJV of req.body.jvNames) {
                await this.databaseService.database.collection(nameCollection[modeJV]).insertOne({ name: nameJV, level: modeJV });
            }
            res.sendStatus(HTTP_OK_STATUS);
        });
    }
}
