import { Injectable } from '@angular/core';
import { GameStatus } from '@app/game-status';
import { ERRORCODE, VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { Subscription } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    gameStatus: GameStatus;
    turn: number;
    turnsSkippedInARow = 0;
    timePerTurn = VALEUR_TEMPS_DEFAULT;
    turnSubscription: Subscription;
    skippedTurnSubscription: Subscription;
    gameStatusSubsciption: Subscription;

    constructor(private socketService: SocketService) {
        // turn is initialize when game start
        this.turn = ERRORCODE;
        this.turnSubscription = this.socketService.turn.subscribe((turnNumber) => {
            this.turn = turnNumber;
        });
        this.skippedTurnSubscription = this.socketService.skippedTurn.subscribe((skippedTurn) => {
            this.turnsSkippedInARow = skippedTurn;
        });
        this.gameStatusSubsciption = this.socketService.gameStatus.subscribe((gameStatus) => {
            this.gameStatus = gameStatus;
        });
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
        if (this.gameStatus < 2) {
            // send info that it is the other's turn
            this.socketService.endTurn(this.turnsSkippedInARow, (this.gameStatus + 1) % 2);
        }
    }
}
