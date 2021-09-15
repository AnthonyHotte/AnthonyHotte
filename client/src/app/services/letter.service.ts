import { Injectable } from '@angular/core';
import { Letter } from '@app/letter';
import { LETTERS } from '@app/all-letters';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LetterService {
    private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();
    message: string[] = [];
    allLetters: Letter[] = []; // array containing all the letters available to be picked (the bank of letters)
    lettersForPlayer: Letter[] = []; // array containing the "hand" of the player, the letters he possesses
    lettersForOpponent: Letter[] = []; // array containing the "hand" of the opponent, the letters he possesses
    buttonPressed: string = ''; // the last button that was pressed by the user.
    indexSelected: number; // the index of the letter that is currently selected in his hand
    MAXLETTERSINHAND: number = 7; // constant that is supposed to be in the constant file
    currentLetterNumberForPlayer: number = 0;
    currentLetterNumberForOpponent: number = 0;

    constructor() {
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.allLetters.push(letter);
            }
        });
    }

    addLettersForPlayer(amount: number): void {
        if(this.currentLetterNumberForPlayer + amount <= this.MAXLETTERSINHAND) {
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
        if(this.currentLetterNumberForOpponent + amount <= this.MAXLETTERSINHAND) {
            this.currentLetterNumberForOpponent += amount;
            for (let i = 0; i < amount; i++) {
                const index: number = Math.floor(Math.random() * this.allLetters.length);
                this.lettersForOpponent.push(this.allLetters[index]);
                this.allLetters.splice(index, 1);
            }
            this.sendNumberOfLettersForOpponent(this.currentLetterNumberForPlayer.toString());
        } 
    }

    getLetters(): Letter[] {
        return this.lettersForPlayer;
    }

    setIndexSelected(buttonPressed: string): void {
        if (buttonPressed === 'ArrowRight' && typeof this.indexSelected !== 'undefined') {
            this.buttonPressed = 'ArrowRight';
            if (this.indexSelected === this.lettersForPlayer.length - 1) {
                this.indexSelected = 0;
            } else {
                this.indexSelected++;
            }
        } else if (buttonPressed === 'ArrowLeft' && typeof this.indexSelected !== 'undefined') {
            this.buttonPressed = 'ArrowLeft';
            if (this.indexSelected === 0) {
                this.indexSelected = this.lettersForPlayer.length - 1;
            } else {
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
}
