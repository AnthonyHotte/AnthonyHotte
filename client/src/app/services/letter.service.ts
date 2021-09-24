import { Injectable } from '@angular/core';
import { LETTERS } from '@app/all-letters';
import { Letter } from '@app/letter';
import { BehaviorSubject, Observable } from 'rxjs';
import { MAXLETTERINHAND } from '@app/constants';
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
    currentLetterNumberForPlayer: number = 0;
    currentLetterNumberForOpponent: number = 0;
    currentMessage: Observable<string>;
    letterIsSelected: boolean;
    selectedLettersForExchangePlayer: Set<number> = new Set<number>();
    selectedLettersForExchangeOpponent: Set<number> = new Set<number>();
    private messageSource = new BehaviorSubject('default message');

    constructor() {
        this.currentMessage = this.messageSource.asObservable();
        this.letterIsSelected = false;
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.allLetters.push(letter);
            }
        });
    }

    addLettersForPlayer(amount: number): void {
        if (this.currentLetterNumberForPlayer + amount <= MAXLETTERINHAND) {
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
        if (this.currentLetterNumberForOpponent + amount <= MAXLETTERINHAND) {
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

    getLettersForExchange() {
        const lettersForReturn: Set<string> = new Set<string>();
        for (const item of this.selectedLettersForExchangePlayer.values()) {
            lettersForReturn.add(this.lettersForPlayer[item].letter);
        }
        return lettersForReturn;
    }

    swapLetters(index1: number, index2: number): void {
        const tempLetter: Letter = this.lettersForPlayer[index1];
        this.lettersForPlayer[index1] = this.lettersForPlayer[index2];
        this.lettersForPlayer[index2] = tempLetter;
    }

    moveLetterRight() {
        if (this.indexSelected === this.lettersForPlayer.length - 1) {
            this.swapLetters(this.indexSelected, 0);
            this.indexSelected = 0;
        } else {
            this.swapLetters(this.indexSelected, this.indexSelected + 1);
            this.indexSelected++;
        }
    }

    moveLetterLeft() {
        if (this.indexSelected === 0) {
            this.swapLetters(this.lettersForPlayer.length - 1, 0);
            this.indexSelected = this.lettersForPlayer.length - 1;
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
            if (this.indexSelected === this.lettersForPlayer.length - 1) {
                i = 0;
            } else {
                i = this.indexSelected + 1;
            }
        }
        for (i; i < this.lettersForPlayer.length; i++) {
            if (buttonPressed.toLowerCase() === this.lettersForPlayer[i].letter.toLowerCase() && !this.selectedLettersForExchangePlayer.has(i)) {
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
                if (typeof this.lettersForPlayer[j].letter !== 'undefined') {
                    if (
                        buttonPressed.toLowerCase() === this.lettersForPlayer[j].letter.toLowerCase() &&
                        !this.selectedLettersForExchangePlayer.has(i)
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
        this.indexSelected = -1; // the index of the letter that is currently selected in his hand
        this.currentLetterNumberForPlayer = 0;
        this.currentLetterNumberForOpponent = 0;
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.allLetters.push(letter);
            }
        });
        this.selectedLettersForExchangePlayer.clear();
    }

    sendLettersInSackNumber() {
        this.messageSource.next(this.allLetters.length.toString());
    }

    exchangeLettersForPlayer() {
        for (const item of this.selectedLettersForExchangePlayer.values()) {
            this.allLetters.push(this.lettersForPlayer[item]);
            const index: number = Math.floor(Math.random() * this.allLetters.length);
            this.lettersForPlayer.splice(item, 1);
            this.lettersForPlayer.push(this.allLetters[index]);
            this.allLetters.splice(index, 1);
        }
        this.selectedLettersForExchangePlayer.clear();
    }

    exchangeLettersForOpponent() {
        for (const item of this.selectedLettersForExchangeOpponent.values()) {
            this.allLetters.push(this.lettersForOpponent[item]);
            const index: number = Math.floor(Math.random() * this.allLetters.length);
            this.lettersForOpponent.splice(item, 1);
            this.lettersForOpponent.push(this.allLetters[index]);
            this.allLetters.splice(index, 1);
        }
        this.selectedLettersForExchangeOpponent.clear();
    }
}
