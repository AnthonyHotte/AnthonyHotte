import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';
// import { Injectable, Injector } from '@angular/core';
import { WordValidationService } from '@app/services/word-validation.service';
import { GameStateService } from './game-state.service';
import { LetterService } from './letter.service';
import { PlaceLettersService } from './place-letters.service';
// import { SoloPlayerService } from './solo-player.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
@Injectable({
    providedIn: 'root',
})
export class SoloOpponent2Service {
    firstTimeToPlay = true;
    constructor(
        private letterService: LetterService,
        private timeManagerService: TimerTurnManagerService,
        //  private soloPlayerService: SoloPlayerService,
        private gameStateService: GameStateService,
        private placeLetterService: PlaceLettersService,
        // private injectionService: Injector, //
        private readonly wordValidatorService: WordValidationService,
    ) {}

    play(): string {
        let tempword;
        const arrayHand: string[] = [];
        for (const letter of this.letterService.players[this.timeManagerService.turn].allLettersInHand) {
            arrayHand.push(letter.letter.toLowerCase());
        }
        if (this.firstTimeToPlay === true) {
            const wordToPlay = this.findValidWords(this.wordValidatorService.dictionnary, arrayHand);
            this.placeLetterService.placeWord('h8v ' + wordToPlay);
            this.firstTimeToPlay = false;
        } else {
            const letteronbord = this.gameStateService.lettersOnBoard;
            for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
                // all line of letter on board
                for (let j = 0; j < Constants.NUMBEROFCASE; j++) {
                    // all colomn of letter on board
                    if (letteronbord[i][j] !== '') {
                        const temparrayHand = arrayHand;
                        temparrayHand.push(letteronbord[i][j]); // add the letter on board with the letter in hand
                        const wordToPlay = this.findValidWords(this.wordValidatorService.dictionnary, temparrayHand);
                        if (wordToPlay !== undefined) {
                            for (const word2 of wordToPlay) {
                                for (let k = 0; k < word2.length; k++) {
                                    const temp = letteronbord[i][j];
                                    // eslint-disable-next-line no-console
                                    console.log(temp);
                                    // eslint-disable-next-line eqeqeq
                                    if (letteronbord[i][j] == word2.charAt(k)) {
                                        if (this.isWordPlayable(word2, i - k, j, 'h')) {
                                            const rowstring = String.fromCharCode(i + k + Constants.SIDELETTERS_TO_ASCII);
                                            tempword = rowstring + (j + 1).toString() + 'h' + ' ' + word2;
                                            break;
                                        } else if (this.isWordPlayable(word2, i, j - k, 'v')) {
                                            const rowstring = String.fromCharCode(i + Constants.SIDELETTERS_TO_ASCII);
                                            tempword = rowstring + (j + 1).toString() + 'v' + ' ' + word2;
                                            break;
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
            this.placeLetterService.placeWord(tempword);
        }
        this.timeManagerService.endTurn();
        return '!placer ' + tempword;
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
        }

        this.placeLetterService.removeLetterInGameState();
        return isPlayable;
    }
}
