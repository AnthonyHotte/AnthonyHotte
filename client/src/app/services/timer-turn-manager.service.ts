import { Injectable } from '@angular/core';

import { ERRORCODE, VALEUR_TEMPS_DEFAULT } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    // signal error, initiation  of the game should change it to 0 or 1
    turn: number;
    turnsSkippedInARow = 0;
    timePerTurn = VALEUR_TEMPS_DEFAULT;

    constructor() {
        // turn is initialize when game start
        this.turn = ERRORCODE;
    }

    // will be move on server
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
