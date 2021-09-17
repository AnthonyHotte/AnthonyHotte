import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GestionTimerTourService {
    turn: number = 0;

    constructor() {
        this.initiateGame();
    }

    initiateGame() {
        this.turn = Math.floor(Math.random() * 2);
    }
    endTurn() {
        if (this.turn === 0) {
            this.turn = 1;
        } else {
            this.turn = 0;
        }
    }
}
