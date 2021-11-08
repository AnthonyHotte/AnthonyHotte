import { DictionaryService } from '@app/services/dictionary.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

const HTTP_STATUS_CREATED = 201;
@Service()
export class DictionaryController {
    router: Router;

    constructor(private readonly dictionaryService: DictionaryService) {
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
        this.router.get('/list', (req: Request, res: Response) => {
            // Send the request to the service and send the response
            res.json(this.dictionaryService.getDictionaryTitleAndDescription());
        });
        /**
         * @swagger
         *
         * /api/dictionary/sendnamechange:
         *   post:
         *     description: Send a dictionary
         *     tags:
         *       - Dictionary
         *     requestBody:
         *         description: dictionary and index object
         *         required: true
         *         content:
         *           application/json:
         *             example:
         *               index: 2
         *               dictionary: new Dictionary('title', 'description');
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/sendnamechange', (req: Request, res: Response) => {
            this.dictionaryService.modifyDictionary(req.body.index, req.body.dictionary);
            res.sendStatus(HTTP_STATUS_CREATED);
        });
    }
}
