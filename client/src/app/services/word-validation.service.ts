import jsonDictionnary from 'src/assets/dictionnary.json';
import { Injectable } from '@angular/core';
import * as constants from '@app/constants';
import { ScoreCalculatorService } from '@app/services/score-calculator.service';

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    dictionnary: string[];
    dicLength: number;
    pointsForLastWord: number;

    constructor(private readonly scoreCalculator: ScoreCalculatorService) {
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

    isPartOfWordVertical(row: number, column: number, lettersOnBoard: string[][]): boolean {
        if (row === 0) {
            if (lettersOnBoard[row + 1][column] === '') {
                return false;
            }
        } else if (row === constants.NUMBEROFCASE - 1) {
            if (lettersOnBoard[row - 1][column] === '') {
                return false;
            }
        } else {
            if (lettersOnBoard[row - 1][column] === '' && lettersOnBoard[row + 1][column] === '') {
                return false;
            }
        }
        return true;
    }

    isPartOfWordHorizontal(row: number, column: number, lettersOnBoard: string[][]): boolean {
        if (column === 0) {
            if (lettersOnBoard[row][column + 1] === '') {
                return false;
            }
        } else if (column === constants.NUMBEROFCASE - 1) {
            if (lettersOnBoard[row][column - 1] === '') {
                return false;
            }
        } else {
            if (lettersOnBoard[row][column - 1] === '' && lettersOnBoard[row][column + 1] === '') {
                return false;
            }
        }
        return true;
    }

    validateHorizontalWord(row: number, column: number, lettersOnBoard: string[][]): boolean {
        let beginIndexWord = 0;
        let lastIndexWord = 0;
        let firstColumnOfWord = 0;
        let wordCreated = '';
        for (column; column >= 0; column--) {
            if (lettersOnBoard[row][column] === '') {
                break;
            }
            firstColumnOfWord = column;
            beginIndexWord = firstColumnOfWord;
        }
        for (firstColumnOfWord; firstColumnOfWord < constants.NUMBEROFCASE; firstColumnOfWord++) {
            if (lettersOnBoard[row][firstColumnOfWord] === '') {
                break;
            }
            wordCreated += lettersOnBoard[row][firstColumnOfWord];
            lastIndexWord = firstColumnOfWord;
        }
        this.pointsForLastWord += this.scoreCalculator.calculateScoreForHorizontal(beginIndexWord, lastIndexWord, row, wordCreated);
        return this.isWordValid(wordCreated);
    }

    validateVerticalWord(row: number, column: number, lettersOnBoard: string[][]): boolean {
        let beginIndexWord = 0;
        let lastIndexWord = 0;
        let firstRowOfWord = 0;
        let wordCreated = '';
        for (row; row >= 0; row--) {
            if (lettersOnBoard[row][column] === '') {
                break;
            }
            firstRowOfWord = row;
            beginIndexWord = firstRowOfWord;
        }
        for (firstRowOfWord; firstRowOfWord < constants.NUMBEROFCASE; firstRowOfWord++) {
            if (lettersOnBoard[firstRowOfWord][column] === '') {
                break;
            }
            wordCreated += lettersOnBoard[firstRowOfWord][column];
            lastIndexWord = firstRowOfWord;
        }
        this.pointsForLastWord += this.scoreCalculator.calculateScoreForVertical(beginIndexWord, lastIndexWord, column, wordCreated);
        return this.isWordValid(wordCreated);
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
