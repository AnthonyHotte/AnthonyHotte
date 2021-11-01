import { WordValidationService } from '@app/services/word-validation.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

const HTTP_STATUS_CREATED = 201;

@Service()
export class DictionnaryController {
    router: Router;

    constructor(private wordValidationService: WordValidationService) {
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
         * /api/dict:
         *   post:
         *     description: Send a message
         *     tags:
         *       - Example
         *       - Message
         *     requestBody:
         *         description: message object
         *         required: true
         *         content:
         *           application/json:
         *             schema:
         *               $ref: '#/definitions/Message'
         *             example:
         *               title: Mon Message
         *               body: Je suis envoyé à partir de la documentation!
         *     produces:
         *       - application/json
         *     responses:
         *       201:
         *         description: Created
         */
        this.router.post('/load', (req: Request, res: Response) => {
            const temp = req.body;
            // const temp2 = JSON.parse(JSON.stringify(temp));
            this.wordValidationService.dictionnary = temp.words;
            this.wordValidationService.dicLength = this.wordValidationService.dictionnary.length;
            res.sendStatus(HTTP_STATUS_CREATED);
        });
    }
}
