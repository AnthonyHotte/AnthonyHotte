import { Injectable } from '@angular/core';
import { VALEUR_TEMPS_DEFAULT } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    turn: number = 0;
    turnsSkippedInARow = 0;
    timePerTurn = VALEUR_TEMPS_DEFAULT;

    constructor() {
        this.initiateGame();
    }

    initiateGame() {
        this.turn = Math.floor(Math.random() * 2);
    }

    endTurn(reason: string) {
        //  const TIME_OUT_TIME = 3000; // TODO debug this
        //  setTimeout(() => {
        if (reason === 'skip') {
            this.turnsSkippedInARow++;
        } else {
            this.turnsSkippedInARow = 0;
        }
        if (this.turn === 0) {
            this.turn = 1;
        } else {
            this.turn = 0;
        }
        // }, TIME_OUT_TIME);
    }
}
