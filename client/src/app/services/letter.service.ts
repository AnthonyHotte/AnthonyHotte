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
    letters: Letter[] = []; // array containing the "hand" of the player, the letters he possesses
    buttonPressed: string = ''; // the last button that was pressed by the user.
    indexSelected: number; // the index of the letter that is currently selected in his hand
    MAXLETTERSINHAND: number = 7; // constant that is supposed to be in the constant file
    currentLetterNumber: number = 0;

    constructor() {
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.allLetters.push(letter);
            }
        });
    }

    addLetters(amount: number): void {
        if(this.currentLetterNumber + amount <= this.MAXLETTERSINHAND) {
            this.currentLetterNumber += amount;
            for (let i = 0; i < amount; i++) {
                const index: number = Math.floor(Math.random() * this.allLetters.length);
                this.letters.push(this.allLetters[index]);
                this.allLetters.splice(index, 1);
            }
            this.changeMessage(this.currentLetterNumber.toString());
        }        
    }

    getLetters(): Letter[] {
        return this.letters;
    }

    setIndexSelected(buttonPressed: string): void {
        if (buttonPressed === 'ArrowRight' && typeof this.indexSelected !== 'undefined') {
            this.buttonPressed = 'ArrowRight';
            if (this.indexSelected === this.letters.length - 1) {
                this.indexSelected = 0;
            } else {
                this.indexSelected++;
            }
        } else if (buttonPressed === 'ArrowLeft' && typeof this.indexSelected !== 'undefined') {
            this.buttonPressed = 'ArrowLeft';
            if (this.indexSelected === 0) {
                this.indexSelected = this.letters.length - 1;
            } else {
                this.indexSelected--;
            }
        } else {
            let i = 0;
            let checkLowerHalf = true;
            if (this.buttonPressed.toLowerCase() === buttonPressed.toLowerCase()) {
                if (this.indexSelected === this.letters.length - 1) {
                    i = 0;
                } else {
                    i = this.indexSelected + 1;
                }
            }
            for (i; i < this.letters.length; i++) {
                if (buttonPressed.toLowerCase() === this.letters[i].letter.toLowerCase()) {
                    this.indexSelected = i;
                    this.buttonPressed = buttonPressed;
                    checkLowerHalf = false;
                    break;
                }
            }
            if (checkLowerHalf) {
                for (let j = 0; j < i; j++) {
                    if (typeof this.letters[j].letter !== 'undefined') {
                        if (buttonPressed.toLowerCase() === this.letters[j].letter.toLowerCase()) {
                            this.indexSelected = j;
                            break;
                        }
                    }
                }
            }
        }
    }

    changeMessage(message: string) {
        this.messageSource.next(message);
    }
}
