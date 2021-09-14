import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class GestionTimerTourService {
    turn: number = 0;
    constructor() {}

    initiateGame() {
        this.turn = 0;
    }
    endTurn() {
        if (this.turn === 0) {
            this.turn = 1;
        } else {
            this.turn = 0;
        }
    }
}
