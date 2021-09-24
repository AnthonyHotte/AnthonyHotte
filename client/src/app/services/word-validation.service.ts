import jsonDictionnary from 'src/assets/dictionnary.json';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    dictionnary: string[];
    dicLength: number;

    constructor() {
        // when importing the json, typescript doesnt let me read it as a json object. To go around this, we stringify it then parse it
        const temp = JSON.stringify(jsonDictionnary);
        const temp2 = JSON.parse(temp);
        this.dictionnary = temp2.words;
        this.dicLength = this.dictionnary.length;
    }
    // The binary search was inspired by the binarysearch method provided here https://www.geeksforgeeks.org/binary-search/
    isWordValid(word: string): boolean {
        return this.isWordInDictionnary(word) && this.isWordLongerThanTwo(word);
    }

    private isWordInDictionnary(word: string): boolean {
        const normalizedWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let normalizedDicWord: string;
        let m: number;
        let l = 0;
        let r = this.dicLength - 1;
        while (l <= r) {
            m = l + Math.floor((r - l) / 2);
            normalizedDicWord = this.dictionnary[m].normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            if (normalizedDicWord === normalizedWord) {
                return true;
            }

            if (normalizedDicWord < normalizedWord) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }

        return false;
    }
    private isWordLongerThanTwo(word: string): boolean {
        if (word.length >= 2) {
            return true;
        } else {
            return false;
        }
    }
}
