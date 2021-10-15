import { Injectable } from '@angular/core';

import { VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    turn: number = 0;
    turnsSkippedInARow = 0;
    timePerTurn = VALEUR_TEMPS_DEFAULT;

    constructor(private comunicationService: CommunicationService) {
        this.initiateGame();
    }

    initiateGame() {
        this.turn = Math.floor(Math.random() * 2);
    }

    endTurn(reason: string) {
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
    }
    getTurn(indexRoom: number) {
        this.comunicationService.getTurnServer(indexRoom).subscribe((turn) => {
            return parseInt(turn.body, 10);
        });
    }
}
