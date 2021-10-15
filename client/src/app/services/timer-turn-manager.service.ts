import { Injectable } from '@angular/core';

import { ERRORCODE, VALEUR_TEMPS_DEFAULT } from '@app/constants';
// import { CommunicationService } from './communication.service';
// import { InitiateGameTypeService } from './initiate-game-type.service';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    // signal error, initiation  of the game should change it to 0 or 1
    turn: number;
    turnsSkippedInARow = 0;
    timePerTurn = VALEUR_TEMPS_DEFAULT;

    constructor() {
        // private comunicationService: CommunicationService, private initiateGameTypeService: InitiateGameTypeService) {
        // turn is initialize when game start
        this.turn = ERRORCODE;
        /*
        this.comunicationService.getTurnServer(this.initiateGameTypeService.roomNumber).subscribe((turnServer) => {
            this.turn = parseInt(turnServer.body, 10);
        });
        */
    }

    // will be move on server
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
}
