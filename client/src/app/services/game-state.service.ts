import { Injectable } from '@angular/core';
import * as constants from '@app/constants';
import { WordValidationService } from '@app/services/word-validation.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { LetterService } from '@app/services/letter.service';

@Injectable({
    providedIn: 'root',
})
export class GameStateService {
    lettersOnBoard: string[][];
    indexLastLetters: number[];
    orientationOfLastWord: string;
    playerUsedAllLetters: boolean;
    lastLettersAdded: string;

    constructor(
        private readonly wordValidator: WordValidationService,
        private timeManager: TimerTurnManagerService,
        private letterService: LetterService,
    ) {
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
            this.indexLastLetters.push(row);
            this.indexLastLetters.push(column);
            this.lastLettersAdded += letter;
            this.lettersOnBoard[row][column] = letter;
        }
        if (this.indexLastLetters.length === constants.MAXLETTERINHAND) {
            this.playerUsedAllLetters = true;
        } else {
            this.playerUsedAllLetters = false;
        }
    }

    validateWordCreatedByNewLetters(): boolean {
        this.wordValidator.indexLastLetters = this.indexLastLetters;
        this.wordValidator.pointsForLastWord = 0;
        if (this.orientationOfLastWord === 'h') {
            if (!this.wordValidator.validateHorizontalWord(this.indexLastLetters[0], this.indexLastLetters[1], this.lettersOnBoard)) {
                return false;
            }
            for (let i = 0; i < this.indexLastLetters.length; i += 2) {
                if (this.wordValidator.isPartOfWordVertical(this.indexLastLetters[i], this.indexLastLetters[i + 1], this.lettersOnBoard)) {
                    if (!this.wordValidator.validateVerticalWord(this.indexLastLetters[i], this.indexLastLetters[i + 1], this.lettersOnBoard)) {
                        return false;
                    }
                }
            }
        } else {
            if (!this.wordValidator.validateVerticalWord(this.indexLastLetters[0], this.indexLastLetters[1], this.lettersOnBoard)) {
                return false;
            }
            for (let i = 0; i < this.indexLastLetters.length; i += 2) {
                if (this.wordValidator.isPartOfWordHorizontal(this.indexLastLetters[i], this.indexLastLetters[i + 1], this.lettersOnBoard)) {
                    if (!this.wordValidator.validateHorizontalWord(this.indexLastLetters[i], this.indexLastLetters[i + 1], this.lettersOnBoard)) {
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

    isWordCreationPossibleWithRessources(): boolean {
        let lettersAvailable = '';
        for (const letter of this.letterService.players[this.timeManager.turn].allLettersInHand) {
            lettersAvailable += letter.letter;
        }
        return this.canWordBeCreated(lettersAvailable);
    }

    canWordBeCreated(lettersAvailable: string): boolean {
        let tempLetters = this.lastLettersAdded;
        let i = 0;
        for (const letter of this.lastLettersAdded) {
            if (lettersAvailable.includes(letter.toUpperCase())) {
                let j = 0;
                for (const letterInHand of lettersAvailable) {
                    if (letterInHand === letter.toUpperCase()) {
                        lettersAvailable = this.removeCharFromString(lettersAvailable, j);
                        tempLetters = this.removeCharFromString(tempLetters, i--);
                        break;
                    }
                    j++;
                }
            }
            i++;
        }
        if (tempLetters.length === 0) {
            return true;
        } else {
            return false;
        }
    }

    // removeCharFromString is inspired from https://stackoverflow.com/a/9932996
    private removeCharFromString(lettersAvailable: string, index: number): string {
        const temp = lettersAvailable.split(''); // convert to an array
        temp.splice(index, 1);
        return temp.join(''); // reconstruct the string
    }
}
