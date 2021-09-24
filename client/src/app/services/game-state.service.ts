import { Injectable } from '@angular/core';
import * as constants from '@app/constants';
import { WordValidationService } from '@app/services/word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class GameStateService {
    lettersOnBoard: string[][];
    lastLettersAdded: number[];
    orientationOfLastWord: string;

    constructor(private readonly wordValidator: WordValidationService) {
        this.lettersOnBoard = [];
        for (let i = 0; i < constants.NUMBEROFCASE; i++) {
            this.lettersOnBoard[i] = [];
            for (let j = 0; j < constants.NUMBEROFCASE; j++) {
                this.lettersOnBoard[i][j] = '';
            }
        }
    }

    placeLetter(row: number, column: number, letter: string) {
        if (this.lettersOnBoard[row][column] !== letter) {
            this.lastLettersAdded.push(row);
            this.lastLettersAdded.push(column);
            this.lettersOnBoard[row][column] = letter;
        }
    }
    isPartOfWordVertical(row: number, column: number): boolean {
        if (row === 0) {
            if (this.lettersOnBoard[row + 1][column] === '') {
                return false;
            }
        } else if (row === constants.NUMBEROFCASE - 1) {
            if (this.lettersOnBoard[row - 1][column] === '') {
                return false;
            }
        } else {
            if (this.lettersOnBoard[row - 1][column] === '' && this.lettersOnBoard[row + 1][column] === '') {
                return false;
            }
        }
        return true;
    }

    isPartOfWordHorizontal(row: number, column: number): boolean {
        if (column === 0) {
            if (this.lettersOnBoard[row][column + 1] === '') {
                return false;
            }
        } else if (column === constants.NUMBEROFCASE - 1) {
            if (this.lettersOnBoard[row][column - 1] === '') {
                return false;
            }
        } else {
            if (this.lettersOnBoard[row][column - 1] === '' && this.lettersOnBoard[row][column + 1] === '') {
                return false;
            }
        }
        return true;
    }

    validateWordCreatedByNewLetters(): boolean {
        if (this.orientationOfLastWord === 'h') {
            if (!this.validateHorizontalWord(this.lastLettersAdded[0], this.lastLettersAdded[1])) {
                return false;
            }
            for (let i = 0; i < this.lastLettersAdded.length; i += 2) {
                if (this.isPartOfWordVertical(this.lastLettersAdded[i], this.lastLettersAdded[i + 1])) {
                    if (!this.validateVerticalWord(this.lastLettersAdded[i], this.lastLettersAdded[i + 1])) {
                        return false;
                    }
                }
            }
        } else {
            if (!this.validateVerticalWord(this.lastLettersAdded[0], this.lastLettersAdded[1])) {
                return false;
            }
            for (let i = 0; i < this.lastLettersAdded.length; i += 2) {
                if (this.isPartOfWordHorizontal(this.lastLettersAdded[i], this.lastLettersAdded[i + 1])) {
                    if (!this.validateHorizontalWord(this.lastLettersAdded[i], this.lastLettersAdded[i + 1])) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    validateHorizontalWord(row: number, column: number): boolean {
        let firstColumnOfWord = 0;
        let wordCreated = '';
        for (column; column >= 0; column--) {
            if (this.lettersOnBoard[row][column] === '') {
                break;
            }
            firstColumnOfWord = column;
        }
        for (firstColumnOfWord; firstColumnOfWord < constants.NUMBEROFCASE; firstColumnOfWord++) {
            if (this.lettersOnBoard[row][firstColumnOfWord] === '') {
                break;
            }
            wordCreated += this.lettersOnBoard[row][firstColumnOfWord];
        }
        return this.wordValidator.isWordValid(wordCreated);
    }

    validateVerticalWord(row: number, column: number): boolean {
        let firstRowOfWord = 0;
        let wordCreated = '';
        for (row; row >= 0; row--) {
            if (this.lettersOnBoard[row][column] === '') {
                break;
            }
            firstRowOfWord = column;
        }
        for (firstRowOfWord; firstRowOfWord < constants.NUMBEROFCASE; firstRowOfWord++) {
            if (this.lettersOnBoard[firstRowOfWord][column] === '') {
                break;
            }
            wordCreated += this.lettersOnBoard[firstRowOfWord][column];
        }
        return this.wordValidator.isWordValid(wordCreated);
    }
}
