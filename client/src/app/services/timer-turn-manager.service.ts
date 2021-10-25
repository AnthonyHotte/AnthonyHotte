import { Injectable } from '@angular/core';
import { GameStatus } from '@app/game-status';
import { ERRORCODE, VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    gameStatus: GameStatus;
    turn: number;
    turnsSkippedInARow = 0;
    timePerTurn = VALEUR_TEMPS_DEFAULT;
    // usefull to send information that turn is over to server
    indexTurn: BehaviorSubject<number>;

    constructor() {
        // turn is initialize when game start
        this.turn = ERRORCODE;
        this.indexTurn = new BehaviorSubject(ERRORCODE);
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
    // to set the game status
    setGameStatus(playerNumber: number, gameType: string) {
        if (gameType === 'solo') {
            this.gameStatus = GameStatus.SoloPlayer;
        } else if (playerNumber === 0) {
            this.gameStatus = GameStatus.CreaterPlayer;
        } else {
            this.gameStatus = GameStatus.JoinPlayer;
        }
    }
}
