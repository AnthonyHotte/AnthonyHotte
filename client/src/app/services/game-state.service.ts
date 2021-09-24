import { Injectable } from '@angular/core';
import * as constants from '@app/constants';
import { WordValidationService } from '@app/services/word-validation.service';
import { ScoreCalculatorService } from '@app/services/score-calculator.service';

@Injectable({
    providedIn: 'root',
})
export class GameStateService {
    lettersOnBoard: string[][];
    lastLettersAdded: number[];
    orientationOfLastWord: string;
    playerUsedAllLetters: boolean;
    pointsForLastWord: number;

    constructor(private readonly wordValidator: WordValidationService, private readonly scoreCalculator: ScoreCalculatorService) {
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
        if (this.lastLettersAdded.length === constants.MAXLETTERINHAND) {
            this.playerUsedAllLetters = true;
        } else {
            this.playerUsedAllLetters = false;
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
        let beginIndexWord = 0;
        let lastIndexWord = 0;
        let firstColumnOfWord = 0;
        let wordCreated = '';
        for (column; column >= 0; column--) {
            if (this.lettersOnBoard[row][column] === '') {
                break;
            }
            firstColumnOfWord = column;
            beginIndexWord = firstColumnOfWord;
        }
        for (firstColumnOfWord; firstColumnOfWord < constants.NUMBEROFCASE; firstColumnOfWord++) {
            if (this.lettersOnBoard[row][firstColumnOfWord] === '') {
                break;
            }
            wordCreated += this.lettersOnBoard[row][firstColumnOfWord];
            lastIndexWord = firstColumnOfWord;
        }
        this.pointsForLastWord += this.scoreCalculator.calculateScoreForHorizontal(beginIndexWord, lastIndexWord, row, wordCreated);
        return this.wordValidator.isWordValid(wordCreated);
    }

    validateVerticalWord(row: number, column: number): boolean {
        let beginIndexWord = 0;
        let lastIndexWord = 0;
        let firstRowOfWord = 0;
        let wordCreated = '';
        for (row; row >= 0; row--) {
            if (this.lettersOnBoard[row][column] === '') {
                break;
            }
            firstRowOfWord = row;
            beginIndexWord = firstRowOfWord;
        }
        for (firstRowOfWord; firstRowOfWord < constants.NUMBEROFCASE; firstRowOfWord++) {
            if (this.lettersOnBoard[firstRowOfWord][column] === '') {
                break;
            }
            wordCreated += this.lettersOnBoard[firstRowOfWord][column];
            lastIndexWord = firstRowOfWord;
        }
        this.pointsForLastWord += this.scoreCalculator.calculateScoreForVertical(beginIndexWord, lastIndexWord, column, wordCreated);
        return this.wordValidator.isWordValid(wordCreated);
    }

    removeLetter(row: number, column: number) {
        this.lettersOnBoard[row][column] = '';
    }
}
