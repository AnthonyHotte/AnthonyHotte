import { Injectable, Injector } from '@angular/core';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { CASESIZE, MAXLETTERINHAND, NUMBEROFCASE } from '@app/constants';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GameStateService } from './game-state.service';
import { LetterPlacementPossibility } from './letter-placement-possibility';
import { LetterService } from './letter.service';
import { PlacementValidity } from './placement-validity';
import { SoloPlayerService } from './solo-player.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
import dictionary from 'src/assets/dictionnary.json';
import { LETTERS } from '@app/all-letters';
import { PlaceLettersService } from './place-letters.service';
import { PossibilityChecker } from '@app/classes/possibility-checker';

@Injectable({
    providedIn: 'root',
})
export class SoloOpponentService {
    message: string;
    messageTimeManager: string;
    subscription: Subscription;
    messageFromSoloPlayer: string[];
    subscriptionTimeManager: Subscription;
    subscriptionSoloPlayer: Subscription;
    myTurn: boolean;
    valueToEndGame: number = 0;
    maximumAllowedSkippedTurns: number;
    numberOfLetters: number = 0;
    messageTextBox: Observable<string[]>;
    score: number = 0;
    currentMessage: Observable<string>;
    lastTurnWasASkip: boolean = false;
    possibleWords: string[];
    possibilityOfPlayWord: string[];
    allRetainedOptions: LetterPlacementPossibility[];
    private messageSource = new BehaviorSubject('default message');
    private messageSoloPlayer = new BehaviorSubject(['turn', 'last turn was a skip']);
    private sourceMessageTextBox = new BehaviorSubject([' ', ' ']);
    private placementPossibilities = new Set<LetterPlacementPossibility>();
    private possibilityCheck: PossibilityChecker;
    private currentFirstLetterOfWord: LetterPlacementPossibility;

    constructor(
        private letters: LetterService,
        private timeManager: TimerTurnManagerService,
        private soloPlayer: SoloPlayerService,
        private gameState: GameStateService,
        private placeLetters: PlaceLettersService,
        private injection: Injector,
    ) {
        this.subscription = PlayerLetterHand.currentMessage.subscribe((message) => (this.message = message));
        this.currentMessage = this.messageSource.asObservable();
        this.letters.players[1].addLetters(MAXLETTERINHAND);
        this.numberOfLetters = parseInt(this.message, 10);
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.subscriptionSoloPlayer = this.soloPlayer.currentMessageToSoloOpponent.subscribe(
            (messageFromSoloPlayer) => (this.messageFromSoloPlayer = messageFromSoloPlayer),
        );
        this.messageTextBox = this.sourceMessageTextBox.asObservable();
        this.maximumAllowedSkippedTurns = 6;
        this.gameState = this.injection.get(GameStateService);
    }

    play() {
        this.myTurn = parseInt(this.messageTimeManager, 10) === 1;
        if (this.myTurn === true) {
            const TIME_OUT_TIME = 3000;
            const INTERVAL_TIME = 17000;
            setTimeout(() => {
                return null;
            }, TIME_OUT_TIME);
            const turnToBeSkipped = window.setInterval(() => {
                this.skipTurn(turnToBeSkipped);
            }, INTERVAL_TIME);
            const HUNDRED = 100;
            const PROBABILITY_OF_ACTION = this.calculateProbability(HUNDRED);
            const TEN = 10;
            const TWENTY = 20;
            if (PROBABILITY_OF_ACTION <= TEN) {
                // skip turn
                this.skipTurn(turnToBeSkipped);
            } else if (PROBABILITY_OF_ACTION <= TWENTY) {
                // trade letters
                const NUMBER_OF_LETTERS_TO_TRADE = this.calculateProbability(this.numberOfLetters);
                if (NUMBER_OF_LETTERS_TO_TRADE <= PlayerLetterHand.allLetters.length) {
                    this.exchangeLetters(NUMBER_OF_LETTERS_TO_TRADE);
                } else {
                    this.skipTurn(turnToBeSkipped);
                }
            } else {
                // play a word
                const PROBABILITY_OF_POINTS = this.calculateProbability(HUNDRED);
                const FORTY = 40;
                const SEVENTY = 70;
                this.findValidPlacesOnBoard();
                const SIX = 6;
                const SEVEN = 7;
                const TWELVE = 12;
                const THIRTEEN = 13;
                const EIGHTEEN = 18;
                if (PROBABILITY_OF_POINTS <= FORTY) {
                    this.findWordsToPlay(0, SIX);
                } else if (PROBABILITY_OF_POINTS <= SEVENTY) {
                    this.findWordsToPlay(SEVEN, TWELVE);
                } else {
                    this.findWordsToPlay(THIRTEEN, EIGHTEEN);
                }
                let text = 'value for the time being';
                const verification = 'Mot placé avec succès.';
                let index = 0;
                while (!(text === verification)) {
                    text = this.placeLetters.placeWord(this.possibleWords[index]);
                    index += 1;
                }
                
                this.timeManager.endTurn();
            }
        }
    }

    calculateProbability(percentage: number) {
        return Math.floor(Math.random() * percentage);
    }

    incrementPassedTurns() {
        this.valueToEndGame = parseInt(this.messageFromSoloPlayer[0], 10);
        this.lastTurnWasASkip = this.messageFromSoloPlayer[1] === 'true';
        if (this.valueToEndGame < this.maximumAllowedSkippedTurns) {
            if (this.lastTurnWasASkip) {
                this.valueToEndGame++;
            } else {
                this.valueToEndGame = 1;
                this.lastTurnWasASkip = true;
            }
            this.myTurn = false;
            this.changeTurn(this.myTurn.toString());
        }
    }

    changeTurn(message: string) {
        this.messageSource.next(message);
        this.myTurn = parseInt(this.message, 10) === 1;
    }

    reset() {
        this.letters.players[1].allLettersInHand = [];
        this.numberOfLetters = this.letters.players[1].numberLetterInHand = 0;
        this.letters.players[1].addLetters(MAXLETTERINHAND);
        this.numberOfLetters = parseInt(this.message, 10);
        this.valueToEndGame = 0;
    }

    getScore() {
        return this.score;
    }

    sendNumberOfSkippedTurn() {
        this.messageSource.next(this.valueToEndGame.toString());
    }

    skipTurn(turnToBeSkipped: number) {
        this.incrementPassedTurns();
        this.messageSoloPlayer.next([this.valueToEndGame.toString(), this.lastTurnWasASkip.toString()]);
        this.timeManager.endTurn();
        setTimeout(() => {
            clearInterval(turnToBeSkipped);
        }, 1);
        const numberOfLetters = 0;
        this.sourceMessageTextBox.next(['!passer', numberOfLetters.toString()]);
    }

    exchangeLetters(numberOfLettersToTrade: number) {
        let i = 0;
        while (i < numberOfLettersToTrade) {
            const INDEX_OF_LETTER_TO_TRADE = this.calculateProbability(this.numberOfLetters);
            if (!this.letters.players[1].selectedLettersForExchange.has(i)) {
                this.letters.players[1].selectedLettersForExchange.add(INDEX_OF_LETTER_TO_TRADE);
                i++;
            }
        }
        this.sendTradedLettersInformation(numberOfLettersToTrade);
        this.letters.players[1].exchangeLetters();
        this.timeManager.endTurn();
    }

    findWordsToPlay(minPointValue: number, maxPointValue: number) {
        const parser = dictionary.toString();
        const jsonObject = JSON.parse(parser);
        const allWords: string[] = jsonObject.words;
        let lettersInString = '';
        let otherLettersRow = '';
        let otherLettersColumn = '';
        for (let i = 0; i < this.numberOfLetters; i++) {
            lettersInString += this.letters.players[1].allLettersInHand[i].letter.toLowerCase();
        }
        for (const item of this.placementPossibilities.values()) {
            otherLettersColumn += item.letter.toLocaleLowerCase();
            otherLettersRow += item.letter.toLocaleLowerCase();
            otherLettersColumn += this.findSameColumnItems(item.row, item.column);
            otherLettersRow += this.findSameRowItems(item.row, item.column);
            this.iterateWords(allWords, item, lettersInString, otherLettersRow, otherLettersColumn);
            otherLettersColumn = '';
            otherLettersRow = '';
        }
        this.eliminateWordsToMatchScore(minPointValue, maxPointValue);
    }

    findSameColumnItems(row: number, column: number) {
        let columnLetters = '';
        for (let i = row + 1; i < CASESIZE; i++) {
            if (this.gameState.lettersOnBoard[i][column] !== '') {
                columnLetters += this.gameState.lettersOnBoard[row][i].toLocaleLowerCase();
            } else {
                columnLetters += ' ';
            }
        }
        return columnLetters;
    }

    findSameRowItems(row: number, column: number) {
        let rowLetters = '';
        for (let i = column + 1; i < CASESIZE; i++) {
            if (this.gameState.lettersOnBoard[row][i] !== '') {
                rowLetters += this.gameState.lettersOnBoard[i][column].toLocaleLowerCase();
            } else {
                rowLetters += ' ';
            }
        }
        return rowLetters;
    }

    eliminateWordsToMatchScore(minPointValue: number, maxPointValue: number) {
        for (let i = 0; i < this.possibleWords.length; i++) {
            let score = 0;
            for (const letter of LETTERS) {
                const temp = letter.letter.toLowerCase();
                for (let j = 0; j < this.possibleWords[i].length; j++) {
                    if (this.possibleWords[i].charAt(j) === temp) {
                        score += letter.point;
                    }
                }
            }
            if (score < minPointValue || score > maxPointValue) {
                this.possibleWords.slice(i);
                i -= 1;
            }
        }
    }

    iterateWords(allWords: string[], item: LetterPlacementPossibility, lettersInString: string, rowLetters: string, columnLetters: string) {
        const NOT_PRESENT = -1;
        for (const word of allWords) {
            let indexOfLetter = 0;
            if ((indexOfLetter = word.search(item.letter)) !== NOT_PRESENT) {
                this.currentFirstLetterOfWord = item;
                let possibleWord = false;
                const temporaryWord = word;
                for (let i = 0; i < lettersInString.length; i++) {
                    if (temporaryWord.search(lettersInString.charAt(i)) !== NOT_PRESENT) {
                        possibleWord = true;
                        temporaryWord.replace(lettersInString.charAt(i), ' ');
                    }
                }
                let isRowsToPlace = item.row - indexOfLetter >= 0;
                let isColumnToPlace = item.column - indexOfLetter >= 0;
                if (possibleWord) {
                    isRowsToPlace &&= this.checkRowsAndColumnsForWordMatch(rowLetters, temporaryWord);
                    isColumnToPlace &&= this.checkRowsAndColumnsForWordMatch(columnLetters, temporaryWord);
                }
                if (isRowsToPlace) {
                    this.currentFirstLetterOfWord.letter = word.charAt(0);
                    this.currentFirstLetterOfWord.row = item.row - indexOfLetter;
                    this.currentFirstLetterOfWord.column = item.column;
                    this.currentFirstLetterOfWord.placement =
                        item.row - indexOfLetter === item.row ? PlacementValidity.Right : PlacementValidity.Left;
                    this.addLetterAndWord(word);
                }
                if (isColumnToPlace) {
                    this.currentFirstLetterOfWord.letter = word.charAt(0);
                    this.currentFirstLetterOfWord.row = item.row;
                    this.currentFirstLetterOfWord.column = item.column - indexOfLetter;
                    this.currentFirstLetterOfWord.placement =
                        item.column - indexOfLetter === item.column ? PlacementValidity.HDown : PlacementValidity.HUp;
                    this.addLetterAndWord(word);
                }
            }
        }
    }

    addLetterAndWord(word: string) {
        this.allRetainedOptions.push(this.currentFirstLetterOfWord);
        this.possibleWords.push(word);
    }

    checkRowsAndColumnsForWordMatch(letters: string, word: string) {
        let possibleWord = false;
        for (let i = 0; i < letters.length; i++) {
            if (letters.charAt(i) === word.charAt(0)) {
                possibleWord = true;
                for (let j = 1; j < word.length; j++) {
                    if (i < letters.length) {
                        i++;
                    }
                    if (letters.charAt(i) !== word.charAt(j)) {
                        possibleWord = false;
                        j = word.length;
                    }
                    if (j === word.length - 1 && possibleWord) {
                        i = letters.length;
                    }
                }
            }
        }
        return possibleWord;
    }

    sendTradedLettersInformation(numberOfLettersToTrade: number) {
        this.sourceMessageTextBox.next(['!échanger', numberOfLettersToTrade.toString()]);
    }

    findValidPlacesOnBoard() {
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                if (this.gameState.lettersOnBoard[i][j] !== '') {
                    let possibility = { row: i, column: j, letter: this.gameState.lettersOnBoard[i][j], placement: PlacementValidity.Nothing };
                    possibility = this.possibilityCheck.checkRight(this.gameState.lettersOnBoard, i, j, possibility);
                    possibility = this.possibilityCheck.checkLeft(this.gameState.lettersOnBoard, i, j, possibility);
                    possibility = this.possibilityCheck.checkDown(this.gameState.lettersOnBoard, i, j, possibility);
                    possibility = this.possibilityCheck.checkUp(this.gameState.lettersOnBoard, i, j, possibility);
                    if (possibility.placement !== PlacementValidity.Nothing) {
                        this.placementPossibilities.add(possibility);
                    }
                }
            }
        }
    }
}
