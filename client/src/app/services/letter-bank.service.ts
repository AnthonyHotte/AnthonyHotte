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
}
