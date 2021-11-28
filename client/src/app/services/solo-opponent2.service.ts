/* eslint-disable max-lines */
import { Injectable } from '@angular/core';
import { BestWordToPlay } from '@app/classes/best-word-to-play';
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
    bestWordsToPlayExpert: BestWordToPlay[] = [];
    wordToPlayLessThan6Points: string[] = [];
    wordToPlay7to12points: string[] = [];
    wordToPlaymore13to18points: string[] = [];
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
        this.bestWordsToPlayExpert = [];
        this.wordToPlayLessThan6Points = [];
        this.wordToPlay7to12points = [];
        this.wordToPlaymore13to18points = [];
        const arrayHand: string[] = [];
        // inital value of positionFirstLetterWordOnLine
        for (const letter of this.letterService.players[this.timeManagerService.turn].allLettersInHand) {
            arrayHand.push(letter.letter.toLowerCase());
        }
        this.bestWordsToPlayExpert[0] = { word: '', score: 0 };
        if (this.gameStateService.isBoardEmpty) {
            await this.playfirstword();
        } else {
            await this.findword(true);
            await this.findword(false);
        }
        if (!this.expertmode) {
            const hundredpercant = 100;
            const chancelessthan6 = 40;
            const chancemorethan6 = 30;
            const PROBABILITY_OF_ACTION = this.calculateProbability(hundredpercant);
            if (PROBABILITY_OF_ACTION < chancelessthan6) {
                tempword = this.wordToPlayLessThan6Points[Math.floor(Math.random() * this.wordToPlayLessThan6Points.length)];
            } else if (PROBABILITY_OF_ACTION < chancemorethan6 + chancelessthan6) {
                tempword = this.wordToPlay7to12points[Math.floor(Math.random() * this.wordToPlay7to12points.length)];
            } else {
                tempword = this.wordToPlaymore13to18points[Math.floor(Math.random() * this.wordToPlaymore13to18points.length)];
            }
        } else {
            if (this.bestWordsToPlayExpert[0] !== undefined) {
                tempword = this.bestWordsToPlayExpert[0].word;
            }
        }
        if (tempword !== '') {
            this.tempword = tempword;
            await this.placeLetterService.placeWord(this.tempword);

            return '!placer ' + tempword;
        } else {
            return '!placer undefined';
        }
    }

    setExpertMode(expert: boolean) {
        this.expertmode = expert;
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
                }
                if (this.gameStateService.lastLettersAdded.length === 0) {
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
    async findword(horizontal: boolean): Promise<string> {
        const minusone = -1;
        const letteronbord = this.gameStateService.lettersOnBoard;
        // let tempword = '';
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
                    await this.findValidWordOrderedByPoint(wordonline, i, positionFirstLetterWordOnLine, horizontal);
                }
            }
        }
        // return tempword
        return 'test';
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
                            const rowstring = String.fromCharCode(x + Constants.SIDELETTERS_TO_ASCII);
                            tempword = rowstring + (y + 1).toString() + orientation + ' ' + word2;
                            this.handleWordPlacingOption(tempword, this.wordValidatorService.pointsForLastWord);
                        }
                    }
                }
            }
        }
        return;
    }
    handleWordPlacingOption(wordtoplace: string, score2: number) {
        const smallerthan = -1;
        const numberOfBestWordToPlayMax = 3;
        if (score2 > this.bestWordsToPlayExpert[this.bestWordsToPlayExpert.length - 1].score) {
            if (this.bestWordsToPlayExpert.length < numberOfBestWordToPlayMax) {
                this.bestWordsToPlayExpert.push({ word: wordtoplace, score: score2 });
            } else if (!this.bestWordsToPlayExpert.find((i) => i.word === wordtoplace)) {
                this.bestWordsToPlayExpert[this.bestWordsToPlayExpert.length - 1] = { word: wordtoplace, score: score2 };
            }
            this.bestWordsToPlayExpert.sort((a, b) => (a.score > b.score ? smallerthan : 1));
        }
        const lowerboundd = 6;
        const middlebound = 12;
        const upperbound = 18;
        if (score2 <= lowerboundd) {
            this.wordToPlayLessThan6Points.push(wordtoplace);
        } else if (score2 <= middlebound) {
            this.wordToPlay7to12points.push(wordtoplace);
        } else if (score2 <= upperbound) {
            this.wordToPlaymore13to18points.push(wordtoplace);
        }
        return;
    }
    calculateProbability(percentage: number) {
        return Math.floor(Math.random() * percentage);
    }
    async playfirstword() {
        const temparrayHand = this.pushLetterToHand();
        const wordToPlay = this.findValidWords(
            this.dictionatyService.dictionaryList[this.dictionatyService.indexDictionary].words,
            temparrayHand,
            true,
        );
        const center = 7;
        let tempword = '';
        for (const word2 of wordToPlay) {
            for (let i = 0; i < word2.length; i++) {
                if (await this.isWordPlayable(word2, center - i, center, 'v')) {
                    const rowstring = String.fromCharCode(center - i + Constants.SIDELETTERS_TO_ASCII);
                    tempword = rowstring + (center + 1).toString() + 'v' + ' ' + word2;
                    this.handleWordPlacingOption(tempword, this.wordValidatorService.pointsForLastWord);
                }
            }
        }
    }
}
