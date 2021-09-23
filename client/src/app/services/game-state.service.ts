import { Injectable } from '@angular/core';
import * as constants from '@app/constants';
// import { WordValidationService } from '@app/services/word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class GameStateService {
    lettersOnBoard: string[][];

    constructor() {
        this.lettersOnBoard = [];
        for (let i = 0; i < constants.NUMBEROFCASE; i++) {
            this.lettersOnBoard[i] = [];
            for (let j = 0; j < constants.NUMBEROFCASE; j++) {
                this.lettersOnBoard[i][j] = '';
            }
        }
    }
}
