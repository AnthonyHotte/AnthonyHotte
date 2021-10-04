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
        PlayerLetterHand.allLetters = [];
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                PlayerLetterHand.allLetters.push(letter);
            }
        });
        for (let i = 0; i < 2; i++) {
            this.players[i].reset();
        }
    }

    swapLetters(index1: number, index2: number): void {
        const tempLetter: Letter = this.players[0].allLettersInHand[index1];
        this.players[0].allLettersInHand[index1] = this.players[0].allLettersInHand[index2];
        this.players[0].allLettersInHand[index2] = tempLetter;
    }

    moveLetterRight() {
        if (this.indexSelected === this.players[0].allLettersInHand.length - 1) {
            this.swapLetters(this.indexSelected, 0);
            this.indexSelected = 0;
        } else {
            this.swapLetters(this.indexSelected, this.indexSelected + 1);
            this.indexSelected++;
        }
    }

    moveLetterLeft() {
        if (this.indexSelected === 0) {
            this.swapLetters(this.players[0].allLettersInHand.length - 1, 0);
            this.indexSelected = this.players[0].allLettersInHand.length - 1;
        } else {
            this.swapLetters(this.indexSelected, this.indexSelected - 1);
            this.indexSelected--;
        }
    }

    selectIndex(buttonPressed: string): boolean {
        let i = 0;
        let checkLowerHalf = true;
        let letterIsThere = false;
        if (this.buttonPressed.toLowerCase() === buttonPressed.toLowerCase()) {
            if (this.indexSelected === this.players[0].allLettersInHand.length - 1) {
                i = 0;
            } else {
                i = this.indexSelected + 1;
            }
        }
        for (i; i < this.players[0].allLettersInHand.length; i++) {
            if (
                buttonPressed.toLowerCase() === this.players[0].allLettersInHand[i].letter.toLowerCase() &&
                !this.players[0].selectedLettersForExchange.has(i)
            ) {
                this.indexSelected = i;
                this.buttonPressed = buttonPressed;
                letterIsThere = true;
                this.letterIsSelected = true;
                checkLowerHalf = false;
                break;
            }
        }
        if (checkLowerHalf) {
            for (let j = 0; j < i; j++) {
                if (typeof this.players[0].allLettersInHand[j].letter !== 'undefined') {
                    if (
                        buttonPressed.toLowerCase() === this.players[0].allLettersInHand[j].letter.toLowerCase() &&
                        !this.players[0].selectedLettersForExchange.has(i)
                    ) {
                        this.indexSelected = j;
                        letterIsThere = true;
                        this.letterIsSelected = true;
                        break;
                    }
                }
            }
        }
        return letterIsThere;
    }

    setIndexSelected(buttonPressed: string): void {
        if (buttonPressed === 'ArrowRight' && typeof this.indexSelected !== 'undefined' && this.letterIsSelected) {
            this.moveLetterRight();
        } else if (buttonPressed === 'ArrowLeft' && typeof this.indexSelected !== 'undefined' && this.letterIsSelected) {
            this.moveLetterLeft();
        } else {
            const playerHasLetter = this.selectIndex(buttonPressed);
            if (!playerHasLetter) {
                this.buttonPressed = '';
                this.letterIsSelected = false;
                this.indexSelected = -1;
            }
        }
    }
}
