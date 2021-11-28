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
         * /api/database/bestscoreclassique:
         *   get:
         *     description: Return best score
         *     produces:
         *       - BestScore[]
         *     responses:
         *       200:
         *
         */
        this.router.get('/bestscoreclassique', async (req: Request, res: Response) => {
            // Send the request to the service and send the response
            const bestScore = await this.databaseService.getBestScoreClassique();

            res.json(bestScore);
        });
        /**
         * @swagger
         *
         * /api/database/bestscorelog2990:
         *   get:
         *     description: Return best score
         *     produces:
         *       - BestScore[]
         *     responses:
         *       200:
         *
         */
        this.router.get('/bestscorelog2990', async (req: Request, res: Response) => {
            // Send the request to the service and send the response
            const bestScore = await this.databaseService.bestScoreLog2990();

            res.json(bestScore);
        });
        /**
         * @swagger
         *
         * /api/database/sendscorechanges:
         *   get:
         *     description: change best score
         *     responses:
         *       200:
         *
         */
        this.router.post('/sendscorechanges', async (req: Request, res: Response) => {
            await this.databaseService.sendScoreChanges(req.body.scoreMode, req.body.best);
            res.sendStatus(HTTP_OK_STATUS);
        });

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
            const nameJv = await this.databaseService.jvEasyNames();

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
            const nameJV = await this.databaseService.jvHardNames();
            res.json(nameJV);
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
            await this.databaseService.sendNamesChanges(modeJV, req.body.jvNames);
            res.sendStatus(HTTP_OK_STATUS);
        });
    }
}
