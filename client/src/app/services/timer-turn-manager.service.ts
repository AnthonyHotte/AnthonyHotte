import { Injectable } from '@angular/core';
import { GameStatus } from '@app/game-status';
import { ERRORCODE, VALEUR_TEMPS_DEFAULT } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class TimerTurnManagerService {
    gameStatus: GameStatus;
    turn: number;
    turnsSkippedInARow = 0;
    timePerTurn = VALEUR_TEMPS_DEFAULT;

    constructor() {
        // turn is initialize when game start
        this.turn = ERRORCODE;
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
    // to set the game status
    setGameStatus(playerNumber: number, gameType: string) {
        if (gameType === 'solo') {
            this.gameStatus = GameStatus.SoloPlayer;
        } else if (playerNumber) {
            this.gameStatus = GameStatus.CreaterPlayer;
        } else {
            this.gameStatus = GameStatus.JoinPlayer;
        }
    }
}
