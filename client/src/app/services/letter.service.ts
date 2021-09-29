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

    getLettersForExchange() {
        const lettersForReturn: Set<string> = new Set<string>();
        for (const item of this.players[0].selectedLettersForExchange.values()) {
            lettersForReturn.add(this.players[0].allLettersInHand[item].letter);
        }
        return lettersForReturn;
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

    selectLetter(letter: string, indexPlayer: number) {
        const NOT_PRESENT = -1;
        let index = NOT_PRESENT;
        for (let i = 0; i < this.players[indexPlayer].allLettersInHand.length; i++) {
            if (
                this.players[indexPlayer].allLettersInHand[i].letter.toLowerCase() === letter.toLowerCase() &&
                !this.players[indexPlayer].selectedLettersForExchange.has(i)
            ) {
                index = i;
                i = this.players[indexPlayer].allLettersInHand.length;
                this.players[indexPlayer].selectedLettersForExchange.add(index);
            }
        }
        return index !== NOT_PRESENT;
    }
}
