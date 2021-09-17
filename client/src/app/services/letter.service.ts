import { Injectable } from '@angular/core';
import { Letter } from '@app/letter';
import { LETTERS } from '@app/all-letters';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LetterService {
    message: string[] = [];
    allLetters: Letter[] = []; // array containing all the letters available to be picked (the bank of letters)
    lettersForPlayer: Letter[] = []; // array containing the "hand" of the player, the letters he possesses
    lettersForOpponent: Letter[] = []; // array containing the "hand" of the opponent, the letters he possesses
    buttonPressed: string = ''; // the last button that was pressed by the user.
    indexSelected: number; // the index of the letter that is currently selected in his hand
    maxLettersInHand: number; // constant that is supposed to be in the constant file
    currentLetterNumberForPlayer: number = 0;
    currentLetterNumberForOpponent: number = 0;
    currentMessage: Observable<string>;
    private messageSource = new BehaviorSubject('default message');

    constructor() {
        this.maxLettersInHand = 7;
        this.currentMessage = this.messageSource.asObservable();
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.allLetters.push(letter);
            }
        });
    }

    addLettersForPlayer(amount: number): void {
        if (this.currentLetterNumberForPlayer + amount <= this.maxLettersInHand) {
            this.currentLetterNumberForPlayer += amount;
            for (let i = 0; i < amount; i++) {
                const index: number = Math.floor(Math.random() * this.allLetters.length);
                this.lettersForPlayer.push(this.allLetters[index]);
                this.allLetters.splice(index, 1);
            }
            this.sendNumberOfLettersForPlayer(this.currentLetterNumberForPlayer.toString());
        }
    }

    addLettersForOpponent(amount: number): void {
        if (this.currentLetterNumberForOpponent + amount <= this.maxLettersInHand) {
            this.currentLetterNumberForOpponent += amount;
            for (let i = 0; i < amount; i++) {
                const index: number = Math.floor(Math.random() * this.allLetters.length);
                this.lettersForOpponent.push(this.allLetters[index]);
                this.allLetters.splice(index, 1);
            }
            this.sendNumberOfLettersForOpponent(this.currentLetterNumberForOpponent.toString());
        }
    }

    getLetters(): Letter[] {
        return this.lettersForPlayer;
    }

    swapLetters(index1: number, index2: number): void {
        const tempLetter: Letter = this.lettersForPlayer[index1];
        this.lettersForPlayer[index1] = this.lettersForPlayer[index2];
        this.lettersForPlayer[index2] = tempLetter;
    }

    setIndexSelected(buttonPressed: string): void {
        if (buttonPressed === 'ArrowRight' && typeof this.indexSelected !== 'undefined') {
            if (this.indexSelected === this.lettersForPlayer.length - 1) {
                this.swapLetters(this.indexSelected, 0);
                this.indexSelected = 0;
            } else {
                this.swapLetters(this.indexSelected, this.indexSelected + 1);
                this.indexSelected++;
            }
        } else if (buttonPressed === 'ArrowLeft' && typeof this.indexSelected !== 'undefined') {
            if (this.indexSelected === 0) {
                this.swapLetters(this.lettersForPlayer.length - 1, 0);
                this.indexSelected = this.lettersForPlayer.length - 1;
            } else {
                this.swapLetters(this.indexSelected, this.indexSelected - 1);
                this.indexSelected--;
            }
        } else {
            let i = 0;
            let checkLowerHalf = true;
            if (this.buttonPressed.toLowerCase() === buttonPressed.toLowerCase()) {
                if (this.indexSelected === this.lettersForPlayer.length - 1) {
                    i = 0;
                } else {
                    i = this.indexSelected + 1;
                }
            }
            for (i; i < this.lettersForPlayer.length; i++) {
                if (buttonPressed.toLowerCase() === this.lettersForPlayer[i].letter.toLowerCase()) {
                    this.indexSelected = i;
                    this.buttonPressed = buttonPressed;
                    checkLowerHalf = false;
                    break;
                }
            }
            if (checkLowerHalf) {
                for (let j = 0; j < i; j++) {
                    if (typeof this.lettersForPlayer[j].letter !== 'undefined') {
                        if (buttonPressed.toLowerCase() === this.lettersForPlayer[j].letter.toLowerCase()) {
                            this.indexSelected = j;
                            break;
                        }
                    }
                }
            }
        }
    }

    sendNumberOfLettersForPlayer(message: string) {
        this.messageSource.next(message);
    }

    sendNumberOfLettersForOpponent(message: string) {
        this.messageSource.next(message);
    }

    reset() {
        this.allLetters = []; // array containing all the letters available to be picked (the bank of letters)
        this.lettersForPlayer = []; // array containing the "hand" of the player, the letters he possesses
        this.lettersForOpponent = []; // array containing the "hand" of the opponent, the letters he possesses
        this.buttonPressed = ''; // the last button that was pressed by the user.
        this.indexSelected = 0; // the index of the letter that is currently selected in his hand
        this.maxLettersInHand = 7; // constant that is supposed to be in the constant file
        this.currentLetterNumberForPlayer = 0;
        this.currentLetterNumberForOpponent = 0;
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.allLetters.push(letter);
            }
        });
    }

    sendLettersInSackNumber() {
        this.messageSource.next(this.allLetters.length.toString());
    }
}
