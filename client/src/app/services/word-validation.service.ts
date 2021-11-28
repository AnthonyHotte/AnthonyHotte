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

    async validateWord(row: number, column: number, lettersOnBoard: string[][], onServer: boolean, isHorizontal: boolean): Promise<boolean> {
        let beginIndexWord = 0;
        let lastIndexWord = 0;
        let firstRowOrColumn = 0;
        let wordCreated = '';
        this.scoreCalculator.indexLastLetters = this.indexLastLetters;

        for (let rowOrCol = isHorizontal ? column : row; rowOrCol >= 0; rowOrCol--) {
            const y = isHorizontal ? row : rowOrCol;
            const x = isHorizontal ? rowOrCol : column;
            if (lettersOnBoard[y][x] === '') {
                break;
            }
            firstRowOrColumn = rowOrCol;
            beginIndexWord = firstRowOrColumn;
        }
        for (firstRowOrColumn; firstRowOrColumn < lettersOnBoard.length; firstRowOrColumn++) {
            const y = isHorizontal ? row : firstRowOrColumn;
            const x = isHorizontal ? firstRowOrColumn : column;
            if (lettersOnBoard[y][x] === '') {
                break;
            }
            wordCreated += lettersOnBoard[y][x];
            lastIndexWord = firstRowOrColumn;
        }
        const rowOrColOfWord = isHorizontal ? row : column;
        this.pointsForLastWord += this.scoreCalculator.calculateScore(beginIndexWord, lastIndexWord, rowOrColOfWord, wordCreated, isHorizontal);
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
