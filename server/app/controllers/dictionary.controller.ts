import { Dictionary } from '@app/classes/dictionary';
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
         * /api/fulldictionary:
         *   get:
         *     description: Return dictionary
         *     tags:
         *       - Dictionary
         *     produces:
         *       - application/json
         *     responses:
         *       200:
         *
         */
        this.router.get('/fulldictionary', (req: Request, res: Response) => {
            // Send the request to the service and send the response
            const index = req.query.indexNumber;
            res.json(this.dictionaryService.getDictWithContent(parseInt(index as string, 10)));
            // TODO
            // res.json();
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

        /**
         * @swagger
         *
         * /api/dictionary/senddeletedictionary:
         *   post:
         *     description: delete a dictionary
         *     tags:
         *       - Dictionary
         *     requestBody:
         *         description: index
         *         required: true
         *         content:
         *           application/json:
         *             example:
         *               index: 2
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/senddeletedictionary', (req: Request, res: Response) => {
            this.dictionaryService.deleteDictionary(req.body.index);
            res.sendStatus(HTTP_STATUS_CREATED);
        });

        /**
         * @swagger
         *
         * /api/dictionary/newdictionary:
         *   post:
         *     description: send a dictionary
         *     tags:
         *       - Dictionary
         *     requestBody:
         *         description: formData
         *         required: true
         *         content:
         *           application/json:
         *             example:
         *               formData: file
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/newdictionary', (req: Request, res: Response) => {
            const dictionary: Dictionary = new Dictionary('title', 'description');
            dictionary.content = req.body.content;
            dictionary.description = req.body.description;
            dictionary.name = req.body.name;
            this.dictionaryService.addFullDictionary(dictionary);
            res.sendStatus(HTTP_STATUS_CREATED);
        });
        /**
         * @swagger
         *
         * /api/dictionary/sendreinitialise:
         *   post:
         *     description: reinitialise dictionaryList
         *     tags:
         *       - Dictionary
         *     requestBody:
         *         required: true
         *         content:
         *           application/json:
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/sendreinitialise', (req: Request, res: Response) => {
            this.dictionaryService.reinitialize();
            res.sendStatus(HTTP_STATUS_CREATED);
        });
    }
}
