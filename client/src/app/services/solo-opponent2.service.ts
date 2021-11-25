import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';
import { WordValidationService } from '@app/services/word-validation.service';
import { DictionaryService } from './dictionary.service';
import { GameStateService } from './game-state.service';
import { LetterService } from './letter.service';
import { PlaceLettersService } from './place-letters.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

@Injectable({
    providedIn: 'root',
})
export class SoloOpponent2Service {
    tempword: string;
    score = 0;
    expertmode = false;
    constructor(
        public letterService: LetterService,
        public timeManagerService: TimerTurnManagerService,
        public gameStateService: GameStateService,
        public placeLetterService: PlaceLettersService,
        // public injectionService: Injector, //
        public wordValidatorService: WordValidationService,
        public dictionatyService: DictionaryService,
    ) {}

    // eslint-disable-next-line complexity
    async play(): Promise<string> {
        let tempword = '';
        const arrayHand: string[] = [];
        // inital value of positionFirstLetterWordOnLine
        for (const letter of this.letterService.players[this.timeManagerService.turn].allLettersInHand) {
            arrayHand.push(letter.letter.toLowerCase());
        }
        if (this.gameStateService.isBoardEmpty) {
            const wordToPlay = this.findValidWords(
                this.dictionatyService.dictionaryList[this.dictionatyService.indexDictionary].words,
                arrayHand,
                true, // we are playing the first word;
            );
            if (wordToPlay.length > 0) {
                tempword = 'h8v ' + wordToPlay[0];
            }
        } else {
            // const wordfound = false;
            if (!this.expertmode) {
                const letteronbord = this.gameStateService.lettersOnBoard;
                // loop1 is an part of the code it is the name of the line we use it it to jump there
                loop1: for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
                    for (let j = 0; j < Constants.NUMBEROFCASE; j++) {
                        // all colomn of letter on board
                        if (letteronbord[i][j] !== '') {
                            const temparrayHand = arrayHand;
                            temparrayHand.push(letteronbord[i][j]); // add the letter on board with the letter in hand
                            const wordToPlay = this.findValidWords(
                                this.dictionatyService.dictionaryList[this.dictionatyService.indexDictionary].words,
                                temparrayHand,
                            );
                            if (wordToPlay.length > 0) {
                                for (const word2 of wordToPlay) {
                                    for (let k = 0; k < word2.length; k++) {
                                        if (letteronbord[i][j] === word2.charAt(k)) {
                                            // find which position is the letter on board in the word
                                            if (await this.isWordPlayable(word2, i, j - k, 'h')) {
                                                const rowstring = String.fromCharCode(i + Constants.SIDELETTERS_TO_ASCII);
                                                tempword = rowstring + (j - k + 1).toString() + 'h' + ' ' + word2;
                                                //  wordfound = true;
                                                break loop1;
                                            } else if (await this.isWordPlayable(word2, i - k, j, 'v')) {
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
            } else if (this.expertmode) {
                // find horizontal word to play
                this.score = 0;
                const temptempword = await this.findword(true);
                if (temptempword !== '') {
                    tempword = temptempword;
                }
                // const temptempword2 = await this.findverticalword();
                const temptempword2 = await this.findword(false);
                if (temptempword2 !== '') {
                    tempword = temptempword2;
                }
            }
        }

        if (tempword !== '') {
            this.tempword = tempword;
            // const TIME_OUT_TIME = 3000; // TODO debug this
            // setTimeout(() => {
            await this.placeLetterService.placeWord(this.tempword);
            // }, TIME_OUT_TIME);

            return '!placer ' + tempword;
        } else {
            return '!placer undefined';
        }
    }

    setExpertMode() {
        this.expertmode = !this.expertmode;
    }
    // return all the word that exist with the letters given;
    findValidWords(dict: string[], letters: string[], firstword?: boolean): string[] {
        const STAR_INDEX = 26;
        const avail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (const letter of letters) {
            if (letter === '*') {
                avail[STAR_INDEX] = avail[STAR_INDEX] + 1;
            } else {
                const index = letter.charCodeAt(0) - Constants.ASCIICODEOFLOWERA;
                avail[index] = avail[index] + 1;
            }
        }
        const result: string[] = [];
        for (const word of dict) {
            if (word.includes(letters[letters.length - 1]) || firstword) {
                const count = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const availCopy = avail;
                let ok = true;
                for (let k = 0; k <= word.length; k++) {
                    const index = word.charCodeAt(k) - Constants.ASCIICODEOFLOWERA;
                    count[index] = count[index] + 1;
                    if (count[index] > availCopy[index]) {
                        if (count[index] > availCopy[index] + availCopy[STAR_INDEX]) {
                            ok = false;
                            break;
                        }
                        // use star tile
                        availCopy[STAR_INDEX] = availCopy[STAR_INDEX] - (count[index] - availCopy[index]);
                    }
                }
                if (ok) {
                    result.push(word);
                }
            }
        }
        return result;
    }

    async isWordPlayable(word: string, row: number, column: number, orientation: string): Promise<boolean> {
        this.placeLetterService.row = row;
        this.placeLetterService.colomnNumber = column;
        this.placeLetterService.orientation = orientation;
        this.placeLetterService.wordToPlace = word;
        this.placeLetterService.lettersToPlace = word;
        let isPlayable = true;
        if (!this.placeLetterService.verifyTileNotOutOfBound()) {
            return false;
        } else if (!this.placeLetterService.verifyAvailable()) {
            return false;
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
                } else if (!(await this.gameStateService.validateWordCreatedByNewLetters(false))) {
                    isPlayable = false;
                }
            } else {
                isPlayable = false;
            }
            this.placeLetterService.removeLetterInGameState();
        }

        return isPlayable;
    }

    pushLetterToHand(): string[] {
        const arrayHand: string[] = [];
        for (const letter of this.letterService.players[this.timeManagerService.turn].allLettersInHand) {
            arrayHand.push(letter.letter.toLowerCase());
        }
        return arrayHand;
    }

    // to be removed eventually, keeping in case the variable swap didn't work
    /*
    async findverticalword(): Promise<string> {
        const minusone = -1;
        const letteronbord = this.gameStateService.lettersOnBoard;
        let tempword = '';
        for (let j = 0; j < Constants.NUMBEROFCASE; j++) {
            let wordonline = '';
            let positionFirstLetterWordOnLine = -1;
            for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
                if (letteronbord[i][j] !== '') {
                    if (wordonline === '') {
                        positionFirstLetterWordOnLine = i;
                    }
                    wordonline += letteronbord[i][j];
                } else if (wordonline !== '' || (i === Constants.NUMBEROFCASE - 1 && positionFirstLetterWordOnLine !== minusone)) {
                    const temptempword = await this.findValidWordOrderedByPoint(wordonline, j, positionFirstLetterWordOnLine, false);
                    if (temptempword !== '') {
                        tempword = temptempword;
                    }
                }
            }
        }
        return tempword;
    }
    */
    async findword(horizontal: boolean): Promise<string> {
        const minusone = -1;
        const letteronbord = this.gameStateService.lettersOnBoard;
        let tempword = '';
        for (let i = 0; i < Constants.NUMBEROFCASE; i++) {
            let wordonline = '';
            let positionFirstLetterWordOnLine = -1;
            for (let j = 0; j < Constants.NUMBEROFCASE; j++) {
                const x = horizontal ? i : j;
                const y = horizontal ? j : i;
                if (letteronbord[x][y] !== '') {
                    if (wordonline === '') {
                        positionFirstLetterWordOnLine = j;
                    }
                    wordonline += letteronbord[x][y];
                } else if (wordonline !== '' || (j === Constants.NUMBEROFCASE - 1 && positionFirstLetterWordOnLine !== minusone)) {
                    const temptempword = await this.findValidWordOrderedByPoint(wordonline, i, positionFirstLetterWordOnLine, horizontal);
                    if (temptempword !== '') {
                        tempword = temptempword;
                    }
                }
            }
        }
        return tempword;
    }
    async findValidWordOrderedByPoint(wordonline: string, i: number, j: number, horizontal: boolean) {
        let tempword = '';
        const letteronbord = this.gameStateService.lettersOnBoard;
        const temparrayHand = this.pushLetterToHand();
        temparrayHand.push(wordonline); // add the letter on board with the letter in hand
        const wordToPlay = this.findValidWords(this.dictionatyService.dictionaryList[this.dictionatyService.indexDictionary].words, temparrayHand);
        if (wordToPlay.length > 0) {
            for (const word2 of wordToPlay) {
                for (let k = 0; k < word2.length; k++) {
                    let x = horizontal ? i : j;
                    // let x = i;
                    let y = horizontal ? j : i;
                    // let y = j;
                    if (letteronbord[x][y] === word2.charAt(k)) {
                        // if (horizontal) {
                        x = horizontal ? x : x - k;
                        y = horizontal ? y - k : y;
                        const orientation = horizontal ? 'h' : 'v';
                        if (await this.isWordPlayable(word2, x, y, orientation)) {
                            if (this.wordValidatorService.pointsForLastWord > this.score) {
                                const rowstring = String.fromCharCode(x + Constants.SIDELETTERS_TO_ASCII);
                                // tempword = rowstring + (j - k + 1).toString() + orientation + ' ' + word2;
                                tempword = rowstring + (y + 1).toString() + orientation + ' ' + word2;
                                this.score = this.wordValidatorService.pointsForLastWord;
                            }
                        }
                        // } else {
                        /*
                        if (await this.isWordPlayable(word2, c, d, orientation)) {
                            if (this.wordValidatorService.pointsForLastWord > this.score) {
                                const rowstring = String.fromCharCode(i - k + Constants.SIDELETTERS_TO_ASCII);
                                tempword = rowstring + (j + 1).toString() + orientation + ' ' + word2;
                                this.score = this.wordValidatorService.pointsForLastWord;
                            }
                        }
                        */
                        // }
                    }
                }
            }
        }
        return tempword;
    }
}
