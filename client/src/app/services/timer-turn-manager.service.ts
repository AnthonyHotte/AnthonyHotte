import { Injectable } from '@angular/core';

import { VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { CommunicationService } from './communication.service';
import { InitiateGameTypeService } from './initiate-game-type.service';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    // signal error, initiation  of the game should change it to 0 or 1
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    turn: number = -1;
    turnsSkippedInARow = 0;
    timePerTurn = VALEUR_TEMPS_DEFAULT;

    constructor(private comunicationService: CommunicationService, private initiateGameTypeService: InitiateGameTypeService) {
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
    // should return 0 or 1, if there is an error it returns -1
    // necessary even if turn is public, because it updates turn before returning it
    getTurn(): number {
        // get the turn from server
        this.comunicationService.getTurnServer(this.initiateGameTypeService.roomNumber).subscribe((turn) => {
            this.turn = parseInt(turn.body, 10);
        });
        return this.turn;
    }
}
