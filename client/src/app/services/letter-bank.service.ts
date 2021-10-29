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
    getindexofALetterinBank(alphabeticlettertoget: string): number {
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        const notAValidIndexvalue = -1;
        for (let i = 0; i < this.letterBank.length; i++) {
            if (this.letterBank[i].letter.toLowerCase() === alphabeticlettertoget) {
                return i;
            }
        }
        return notAValidIndexvalue; // return -1 in the case that the letter wouldn't be found in the bank
    }
}
