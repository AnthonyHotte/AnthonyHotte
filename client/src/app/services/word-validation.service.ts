import { Injectable } from '@angular/core';
import { ScoreCalculatorService } from '@app/services/score-calculator.service';
import { Subscription } from 'rxjs';
import { DictionaryService } from './dictionary.service';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class WordValidationService {
    pointsForLastWord: number;
    indexLastLetters: number[] = [];
    validatedWord: boolean;
    validatedSubscription: Subscription;
    wordsCreatedLastTurn: string[];

    constructor(readonly scoreCalculator: ScoreCalculatorService, private socket: SocketService, private dictionaryService: DictionaryService) {
        // this.dictionaryService.getDictionary();

        this.validatedSubscription = this.socket.isWordValid.subscribe((value: boolean) => {
            this.validatedWord = value;
        });
        this.wordsCreatedLastTurn = [];
    }
    // The binary search was inspired by the binarysearch method provided here https://www.geeksforgeeks.org/binary-search/
    isWordValid(word: string): boolean {
        return this.isWordInDictionnary(word) && this.isWordLongerThanTwo(word);
    }

    isPartOfWord(row: number, column: number, lettersOnBoard: string[][], isHorizontal: boolean): boolean {
        const criticalFactor = isHorizontal ? column : row;
        const y1 = isHorizontal ? row : row + 1;
        const x1 = isHorizontal ? column + 1 : column;
        const y2 = isHorizontal ? row : row - 1;
        const x2 = isHorizontal ? column - 1 : column;
        if (criticalFactor === 0) {
            if (lettersOnBoard[y1][x1] === '') {
                return false;
            }
        } else if (criticalFactor === lettersOnBoard.length - 1) {
            if (lettersOnBoard[y2][x2] === '') {
                return false;
            }
        } else {
            if (lettersOnBoard[y2][x2] === '' && lettersOnBoard[y1][x1] === '') {
                return false;
            }
        }
        return true;
    }

    async validateHorizontalWord(row: number, column: number, lettersOnBoard: string[][], onServer: boolean): Promise<boolean> {
        // validateHorizontalWord(row: number, column: number, lettersOnBoard: string[][], onServer: boolean): boolean {
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
        this.pointsForLastWord += this.scoreCalculator.calculateScore(beginIndexWord, lastIndexWord, row, wordCreated, true);
        if (onServer) {
            this.wordsCreatedLastTurn.push(wordCreated);
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
        this.pointsForLastWord += this.scoreCalculator.calculateScore(beginIndexWord, lastIndexWord, column, wordCreated, false);
        if (onServer) {
            this.wordsCreatedLastTurn.push(wordCreated);
            return await this.socket.validateWord(wordCreated);
        } else {
            return this.isWordValid(wordCreated);
        }
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
        let r = this.dictionaryService.dictionaryList[this.dictionaryService.indexDictionary].words.length - 1;
        while (l <= r) {
            m = l + Math.floor((r - l) / 2);
            normalizedDicWord = this.dictionaryService.dictionaryList[this.dictionaryService.indexDictionary].words[m]
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '');

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
