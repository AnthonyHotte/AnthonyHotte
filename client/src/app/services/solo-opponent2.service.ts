import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';
import { WordValidationService } from '@app/services/word-validation.service';
import { GameStateService } from './game-state.service';
import { LetterService } from './letter.service';
import { PlaceLettersService } from './place-letters.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
@Injectable({
    providedIn: 'root',
})
export class SoloOpponent2Service {
    tempword: string;
    constructor(
        public letterService: LetterService,
        public timeManagerService: TimerTurnManagerService,
        public gameStateService: GameStateService,
        public placeLetterService: PlaceLettersService,
        // public injectionService: Injector, //
        public wordValidatorService: WordValidationService,
    ) {}

    play(): string {
        let tempword: string | undefined;
        const arrayHand: string[] = [];
        for (const letter of this.letterService.players[this.timeManagerService.turn].allLettersInHand) {
            arrayHand.push(letter.letter.toLowerCase());
        }
        if (this.gameStateService.isBoardEmpty) {
            const wordToPlay = this.findValidWords(this.wordValidatorService.dictionnary, arrayHand);
            if (wordToPlay.length > 0) {
                tempword = 'h8v ' + wordToPlay[0];
            }
        } else {
            // const wordfound = false;
            const letteronbord = this.gameStateService.lettersOnBoard;
            loop1: for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
                for (let j = 0; j < Constants.NUMBEROFCASE; j++) {
                    // all colomn of letter on board
                    if (letteronbord[i][j] !== '') {
                        const temparrayHand = arrayHand;
                        temparrayHand.push(letteronbord[i][j]); // add the letter on board with the letter in hand
                        const wordToPlay = this.findValidWords(this.wordValidatorService.dictionnary, temparrayHand);
                        if (wordToPlay.length > 0) {
                            for (const word2 of wordToPlay) {
                                for (let k = 0; k < word2.length; k++) {
                                    if (letteronbord[i][j] === word2.charAt(k)) {
                                        // find which position is the letter on board in the word
                                        if (this.isWordPlayable(word2, i, j - k, 'h')) {
                                            const rowstring = String.fromCharCode(i + Constants.SIDELETTERS_TO_ASCII);
                                            tempword = rowstring + (j - k + 1).toString() + 'h' + ' ' + word2;
                                            //  wordfound = true;
                                            break loop1;
                                        } else if (this.isWordPlayable(word2, i - k, j, 'v')) {
                                            const rowstring = String.fromCharCode(i - k + Constants.SIDELETTERS_TO_ASCII);
                                            tempword = rowstring + (j + 1).toString() + 'v' + ' ' + word2;
                                            //  wordfound = true;
                                            break loop1;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (tempword !== undefined) {
            this.tempword = tempword;
            // const TIME_OUT_TIME = 3000; // TODO debug this
            // setTimeout(() => {
            this.placeLetterService.placeWord(this.tempword);
            // }, TIME_OUT_TIME);

            return '!placer ' + tempword;
        } else {
            return '!placer ' + tempword;
        }
    }
    // return all the word that exist with the letters given;
    findValidWords(dict: string[], letters: string[]): string[] {
        const STAR_INDEX = 26;
        const avail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (const letter of letters) {
            if (letter === '*') {
                avail[STAR_INDEX] = avail[STAR_INDEX] + 1;
            } else {
                if (letter !== undefined) {
                    const index = letter.charCodeAt(0) - Constants.ASCIICODEOFLOWERA;
                    avail[index] = avail[index] + 1;
                }
            }
        }
        const result: string[] = [];
        for (const word of dict) {
            const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
            let ok = true;
            for (let k = 0; k <= word.length; k++) {
                const index = word.charCodeAt(k) - Constants.ASCIICODEOFLOWERA;
                count[index] = count[index] + 1;
                if (count[index] > avail[index]) {
                    ok = false;
                    break;
                }
            }
            if (ok) {
                result.push(word);
            }
        }
        return result;
    }

    isWordPlayable(word: string, row: number, column: number, orientation: string): boolean {
        this.placeLetterService.row = row;
        this.placeLetterService.colomnNumber = column;
        this.placeLetterService.orientation = orientation;
        this.placeLetterService.wordToPlace = word;
        this.placeLetterService.lettersToPlace = word;
        let isPlayable = true;
        if (!this.placeLetterService.verifyTileNotOutOfBound()) {
            isPlayable = false;
        } else if (!this.placeLetterService.verifyAvailable()) {
            isPlayable = false;
        } else {
            this.placeLetterService.placeWordGameState();
            if (this.gameStateService.isWordCreationPossibleWithRessources()) {
                if (this.gameStateService.isBoardEmpty) {
                    if (!this.gameStateService.isLetterOnh8()) {
                        isPlayable = false;
                    }
                } else if (this.gameStateService.lastLettersAdded.length === 0) {
                    isPlayable = false;
                } else if (!this.gameStateService.isWordTouchingLetterOnBoard(word, this.placeLetterService.orientation)) {
                    isPlayable = false;
                } else if (!this.gameStateService.validateWordCreatedByNewLetters()) {
                    isPlayable = false;
                }
            } else {
                isPlayable = false;
            }
            this.placeLetterService.removeLetterInGameState();
        }

        return isPlayable;
    }
}
