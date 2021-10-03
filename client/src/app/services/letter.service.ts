import { Injectable } from '@angular/core';
import { LETTERS } from '@app/all-letters';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';

@Injectable({
    providedIn: 'root',
})
export class LetterService {
    players: PlayerLetterHand[]; // index 0 for the real player, index 1 for the computer

    constructor() {
        this.players = [new PlayerLetterHand(), new PlayerLetterHand()];
        PlayerLetterHand.allLetters = [];
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                PlayerLetterHand.allLetters.push(letter);
            }
        });
    }


    reset() {
        for (let i = 0; i < 2; i++) {
            this.players[i].reset();
        }
        PlayerLetterHand.allLetters = [];
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                PlayerLetterHand.allLetters.push(letter);
            }
        });
    }
}
