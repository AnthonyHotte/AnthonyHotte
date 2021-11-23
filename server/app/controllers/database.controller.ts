import { BestScore } from '@app/classes/best-score-interface';
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
            const bestScore: BestScore[] = [];
            await this.databaseService.database
                .collection('bestScoreClassique')
                .find()
                .forEach((document) => {
                    bestScore.push({ score: document.score, name: document.name });
                });

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
            const bestScore: BestScore[] = [];
            await this.databaseService.database
                .collection('bestScoreLog2990')
                .find()
                .forEach((document) => {
                    bestScore.push({ score: document.score, name: document.name });
                });

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
            const mode = req.body.scoreMode;
            const nameCollection = ['bestScoreClassique', 'bestScoreLog2990'];
            this.databaseService.database.collection(nameCollection[mode]).deleteMany({});
            for (const bestScore of req.body.best) {
                await this.databaseService.database.collection(nameCollection[mode]).insertOne({ score: bestScore.score, name: bestScore.name });
            }
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