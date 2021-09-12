import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class TextBoxService {
    constructor() {}

    word: string = '';
    array: string[] = [];
    alertMessage: string = '';

    inputChecking(myButtonCode: number, myButtonValue: string) {
        if (myButtonCode === 13 && this.wordIsGood(this.word)) {
            this.array.push(this.word);
            this.word = '';
            this.alertMessage = '';
        } else if (myButtonCode === 13 && !this.wordIsGood(this.word)) {
            this.alertMessage = 'Votre commande est trop longue';
        } else if (myButtonCode === 8) {
            this.word = this.word.substring(0, this.word.length - 1);
        } else {
            this.word += myButtonValue;
            this.alertMessage = '';
        }
    }

    wordIsGood(myWord: string): boolean {
        return myWord.length < 5;
    }
}
