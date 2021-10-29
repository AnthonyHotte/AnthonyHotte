import { Injectable } from '@angular/core';
import { LETTERS } from '@app/all-letters';
import { Letter } from '@app/letter';

@Injectable({
    providedIn: 'root',
})
export class LetterBankService {
    letterBank: Letter[] = [];
    constructor() {
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.letterBank.push(letter);
            }
        });
    }

    getLettersInBank(): string {
        let lettersInBank = '';
        LETTERS.forEach((letter) => {
            lettersInBank += '\n' + letter.letter + ' : ';
            let numberOfLetter = 0;
            for (const letterInBank of this.letterBank) {
                if (letterInBank.letter.toLowerCase() === letter.letter.toLowerCase()) {
                    numberOfLetter++;
                }
            }
            lettersInBank += numberOfLetter;
        });
        return lettersInBank;
    }
}
