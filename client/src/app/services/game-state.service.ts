import { Injectable } from '@angular/core';
import * as constants from '@app/constants';
import { LetterService } from '@app/services/letter.service';
import { ScoreCalculatorService } from '@app/services/score-calculator.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { WordValidationService } from '@app/services/word-validation.service';

@Injectable({
    providedIn: 'root',
})
export class GameStateService {
    lettersOnBoard: string[][];
    indexLastLetters: number[];
    lastLettersAdded: string;
    orientationOfLastWord: string;
    lastLettersAddedJoker: string;
    playerUsedAllLetters: boolean;
    isBoardEmpty: boolean;

    constructor(
        private readonly wordValidator: WordValidationService,
        public timeManager: TimerTurnManagerService,
        public letterService: LetterService,
        private scoreCalculator: ScoreCalculatorService,
    ) {
        this.lettersOnBoard = [];
        this.isBoardEmpty = true;
        this.lastLettersAddedJoker = '';
        for (let i = 0; i < constants.NUMBEROFCASE; i++) {
            this.lettersOnBoard[i] = [];
            for (let j = 0; j < constants.NUMBEROFCASE; j++) {
                this.lettersOnBoard[i][j] = '';
            }
        }
    }
    // letterJoker is an optional parameter if nothing pass then letterJoker=''
    placeLetter(row: number, column: number, letter: string, letterJoker: string = '') {
        if (this.lettersOnBoard[row][column] !== letter) {
            this.indexLastLetters.push(row);
            this.indexLastLetters.push(column);
            this.lastLettersAdded += letter;
            this.lastLettersAddedJoker += letterJoker;
            if (letterJoker === '*') {
                this.scoreCalculator.indexJoker.push(row);
                this.scoreCalculator.indexJoker.push(column);
            }
            this.lettersOnBoard[row][column] = letter;
        }
        // magic number two is ther because we are doing 2 push for each letter added
        if (this.indexLastLetters.length === 2 * constants.MAXLETTERINHAND) {
            this.playerUsedAllLetters = true;
        } else {
            this.playerUsedAllLetters = false;
        }
    }

    async validateWordCreatedByNewLetters(): Promise<boolean> {
        this.wordValidator.indexLastLetters = this.indexLastLetters;
        this.wordValidator.pointsForLastWord = 0;
        if (this.orientationOfLastWord === 'h') {
            if (!(await this.wordValidator.validateHorizontalWord(this.indexLastLetters[0], this.indexLastLetters[1], this.lettersOnBoard))) {
                return false;
            }
            for (let i = 0; i < this.indexLastLetters.length; i += 2) {
                if (this.wordValidator.isPartOfWordVertical(this.indexLastLetters[i], this.indexLastLetters[i + 1], this.lettersOnBoard)) {
                    if (
                        !(await this.wordValidator.validateVerticalWord(this.indexLastLetters[i], this.indexLastLetters[i + 1], this.lettersOnBoard))
                    ) {
                        return false;
                    }
                }
            }
        } else {
            if (!(await this.wordValidator.validateVerticalWord(this.indexLastLetters[0], this.indexLastLetters[1], this.lettersOnBoard))) {
                return false;
            }
            for (let i = 0; i < this.indexLastLetters.length; i += 2) {
                if (this.wordValidator.isPartOfWordHorizontal(this.indexLastLetters[i], this.indexLastLetters[i + 1], this.lettersOnBoard)) {
                    if (
                        !(await this.wordValidator.validateHorizontalWord(
                            this.indexLastLetters[i],
                            this.indexLastLetters[i + 1],
                            this.lettersOnBoard,
                        ))
                    ) {
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
        let tempLetters = this.lastLettersAddedJoker;
        let i = 0;
        for (const letter of this.lastLettersAddedJoker) {
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
    isLetterOnh8(): boolean {
        for (let i = 0; i < this.indexLastLetters.length; i += 2) {
            if (this.indexLastLetters[i] === constants.CENTERCASE - 1 && this.indexLastLetters[i + 1] === constants.CENTERCASE - 1) {
                return true;
            }
        }
        return false;
    }

    isWordTouchingLetterOnBoard(wordToPlace: string, orientation: string): boolean {
        if (this.lastLettersAdded.length !== wordToPlace.length || this.isBoardEmpty) {
            return true;
        } else if (orientation === 'h') {
            return this.isWordTouchingHorizontal();
        } else {
            return this.isWordTouchingVertical();
        }
    }
    isWordTouchingHorizontal(): boolean {
        for (let i = 0; i < this.indexLastLetters.length; i += 2) {
            if (i === 0 && this.indexLastLetters[i + 1] !== 0) {
                if (this.lettersOnBoard[this.indexLastLetters[i]][this.indexLastLetters[i + 1] - 1] !== '') {
                    return true;
                }
            } else if (i === this.indexLastLetters.length - 2 && this.indexLastLetters[i + 1] !== constants.FOURTEEN) {
                if (this.lettersOnBoard[this.indexLastLetters[i]][this.indexLastLetters[i + 1] + 1] !== '') {
                    return true;
                }
            }
            if (this.indexLastLetters[i] === 0) {
                if (this.lettersOnBoard[this.indexLastLetters[i] + 1][this.indexLastLetters[i + 1]] !== '') {
                    return true;
                }
            } else if (this.indexLastLetters[i] === constants.FOURTEEN) {
                if (this.lettersOnBoard[this.indexLastLetters[i] - 1][this.indexLastLetters[i + 1]] !== '') {
                    return true;
                }
            } else {
                if (
                    this.lettersOnBoard[this.indexLastLetters[i] - 1][this.indexLastLetters[i + 1]] !== '' ||
                    this.lettersOnBoard[this.indexLastLetters[i] + 1][this.indexLastLetters[i + 1]] !== ''
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    isWordTouchingVertical(): boolean {
        for (let i = 0; i < this.indexLastLetters.length; i += 2) {
            if (i === 0 && this.indexLastLetters[i] !== 0) {
                if (this.lettersOnBoard[this.indexLastLetters[i] - 1][this.indexLastLetters[i + 1]] !== '') {
                    return true;
                }
            } else if (i === this.indexLastLetters.length - 2 && this.indexLastLetters[i] !== constants.FOURTEEN) {
                if (this.lettersOnBoard[this.indexLastLetters[i] + 1][this.indexLastLetters[i + 1]] !== '') {
                    return true;
                }
            }
            if (this.indexLastLetters[i + 1] === 0) {
                if (this.lettersOnBoard[this.indexLastLetters[i]][this.indexLastLetters[i + 1] + 1] !== '') {
                    return true;
                }
            } else if (this.indexLastLetters[i + 1] === constants.FOURTEEN) {
                if (this.lettersOnBoard[this.indexLastLetters[i]][this.indexLastLetters[i + 1] - 1] !== '') {
                    return true;
                }
            } else {
                if (
                    this.lettersOnBoard[this.indexLastLetters[i]][this.indexLastLetters[i + 1] - 1] !== '' ||
                    this.lettersOnBoard[this.indexLastLetters[i]][this.indexLastLetters[i + 1] + 1] !== ''
                ) {
                    return true;
                }
            }
        }
        return false;
    }
    // removeCharFromString is inspired from https://stackoverflow.com/a/9932996
    private removeCharFromString(lettersAvailable: string, index: number): string {
        const temp = lettersAvailable.split(''); // convert to an array
        temp.splice(index, 1);
        return temp.join(''); // reconstruct the string
    }
}
