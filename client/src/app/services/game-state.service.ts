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
    playerUsedAllLetters: boolean;

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
        if (this.lastLettersAdded.length === constants.MAXLETTERINHAND) {
            this.playerUsedAllLetters = true;
        } else {
            this.playerUsedAllLetters = false;
        }
    }

    validateWordCreatedByNewLetters(): boolean {
        this.wordValidator.pointsForLastWord = 0;
        if (this.orientationOfLastWord === 'h') {
            if (!this.wordValidator.validateHorizontalWord(this.lastLettersAdded[0], this.lastLettersAdded[1], this.lettersOnBoard)) {
                return false;
            }
            for (let i = 0; i < this.lastLettersAdded.length; i += 2) {
                if (this.wordValidator.isPartOfWordVertical(this.lastLettersAdded[i], this.lastLettersAdded[i + 1], this.lettersOnBoard)) {
                    if (!this.wordValidator.validateVerticalWord(this.lastLettersAdded[i], this.lastLettersAdded[i + 1], this.lettersOnBoard)) {
                        return false;
                    }
                }
            }
        } else {
            if (!this.wordValidator.validateVerticalWord(this.lastLettersAdded[0], this.lastLettersAdded[1], this.lettersOnBoard)) {
                return false;
            }
            for (let i = 0; i < this.lastLettersAdded.length; i += 2) {
                if (this.wordValidator.isPartOfWordHorizontal(this.lastLettersAdded[i], this.lastLettersAdded[i + 1], this.lettersOnBoard)) {
                    if (!this.wordValidator.validateHorizontalWord(this.lastLettersAdded[i], this.lastLettersAdded[i + 1], this.lettersOnBoard)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    removeLetter(row: number, column: number) {
        this.lettersOnBoard[row][column] = '';
    }
}
