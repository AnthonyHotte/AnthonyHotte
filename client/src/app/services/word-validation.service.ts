import { Injectable } from '@angular/core';
import { ScoreCalculatorService } from '@app/services/score-calculator.service';
import { Subscription } from 'rxjs';
import jsonDictionnary from 'src/assets/dictionnary.json';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    dictionnary: string[];
    dicLength: number;
    pointsForLastWord: number;
    indexLastLetters: number[] = [];
    validatedWord: boolean;
    validatedSubscription: Subscription;

    constructor(readonly scoreCalculator: ScoreCalculatorService, private socket: SocketService) {
        // when importing the json, typescript doesnt let me read it as a json object. To go around this, we stringify it then parse it
        const temp = JSON.stringify(jsonDictionnary);
        const temp2 = JSON.parse(temp);
        this.dictionnary = temp2.words;
        this.dicLength = this.dictionnary.length;
        this.validatedSubscription = this.socket.isWordValid.subscribe((value: boolean) => {
            this.validatedWord = value;
        });
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
        } else if (row === lettersOnBoard.length - 1) {
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
        } else if (column === lettersOnBoard.length - 1) {
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

    async validateHorizontalWord(row: number, column: number, lettersOnBoard: string[][], onServer: boolean): Promise<boolean> {
        let beginIndexWord = 0;
        let lastIndexWord = 0;
        let firstColumnOfWord = 0;
        let wordCreated = '';
        this.scoreCalculator.indexLastLetters = this.indexLastLetters;
        for (column; column >= 0; column--) {
            if (lettersOnBoard[row][column] === '') {
                break;
            }
            firstColumnOfWord = column;
            beginIndexWord = firstColumnOfWord;
        }
        for (firstColumnOfWord; firstColumnOfWord < lettersOnBoard.length; firstColumnOfWord++) {
            if (lettersOnBoard[row][firstColumnOfWord] === '') {
                break;
            }
            wordCreated += lettersOnBoard[row][firstColumnOfWord];
            lastIndexWord = firstColumnOfWord;
        }
        this.pointsForLastWord += this.scoreCalculator.calculateScoreForHorizontal(beginIndexWord, lastIndexWord, row, wordCreated);
        // this.socket.isWordValidationFinished = false;
        // emit to server word validation with word
        // while (!this.socket.isWordValidationFinished) {}
        // this.socket.validateWord(wordCreated);

        // set timer
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        //  const timeToWait = 3000;
        // this.delay(timeToWait);
        // return this.validatedWord;
        // temporaire
        if (onServer) {
            return await this.socket.validateWord(wordCreated);
        } else {
            return this.isWordValid(wordCreated);
        }
    }

    async validateVerticalWord(row: number, column: number, lettersOnBoard: string[][], onServer: boolean): Promise<boolean> {
        let beginIndexWord = 0;
        let lastIndexWord = 0;
        let firstRowOfWord = 0;
        let wordCreated = '';
        this.scoreCalculator.indexLastLetters = this.indexLastLetters;
        for (row; row >= 0; row--) {
            if (lettersOnBoard[row][column] === '') {
                break;
            }
            firstRowOfWord = row;
            beginIndexWord = firstRowOfWord;
        }
        for (firstRowOfWord; firstRowOfWord < lettersOnBoard.length; firstRowOfWord++) {
            if (lettersOnBoard[firstRowOfWord][column] === '') {
                break;
            }
            wordCreated += lettersOnBoard[firstRowOfWord][column];
            lastIndexWord = firstRowOfWord;
        }
        this.pointsForLastWord += this.scoreCalculator.calculateScoreForVertical(beginIndexWord, lastIndexWord, column, wordCreated);
        // this.socket.validateWord(wordCreated);

        // set timer
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        // const timeToWait = 3000;
        // this.delay(timeToWait);
        // return this.validatedWord;
        // temporaire
        if (onServer) {
            return await this.socket.validateWord(wordCreated);
        } else {
            return this.isWordValid(wordCreated);
        }
    }
    async delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    isWordLongerThanTwo(word: string): boolean {
        if (word.length >= 2) {
            return true;
        } else {
            return false;
        }
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
}
