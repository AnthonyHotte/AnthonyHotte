import { VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { Service } from 'typedi';

@Service()
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

    // pas encore utiliser
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
