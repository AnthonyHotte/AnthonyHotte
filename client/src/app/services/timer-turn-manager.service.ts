import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    turn: number = 0;
    turnsSkippedInARow = 0;

    constructor() {
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
}
