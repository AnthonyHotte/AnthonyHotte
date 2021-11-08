import { DictionaryService } from '@app/services/dictionary.service';
import { Request, Response, Router } from 'express';
import { Service } from 'typedi';

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
    }
}
