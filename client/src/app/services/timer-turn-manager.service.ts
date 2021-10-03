import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    turn: number = 0;
    turnsSkippedInARow = 0;
    currentMessage: Observable<string>;
    messageSource = new BehaviorSubject('default message');

    constructor() {
        this.initiateGame();
        this.currentMessage = this.messageSource.asObservable();
        this.sendTurn();
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
        this.sendTurn();
    }

    sendTurn() {
        this.messageSource.next(this.turn.toString());
    }
}
