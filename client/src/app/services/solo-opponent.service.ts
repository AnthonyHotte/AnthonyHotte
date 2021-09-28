import { Injectable, Injector } from '@angular/core';
import { LETTERS } from '@app/all-letters';
import { LetterPlacementPossibility } from '@app/classes/letter-placement-possibility';
import { PlacementValidity } from '@app/classes/placement-validity';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { PossibilityChecker } from '@app/classes/possibility-checker';
import { SoloOpponentUsefulFunctions } from '@app/classes/solo-opponent-useful-functions';
import { CENTERCASE, MAXLETTERINHAND, NUMBEROFCASE } from '@app/constants';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GameStateService } from './game-state.service';
import { LetterService } from './letter.service';
import { PlaceLettersService } from './place-letters.service';
import { SoloPlayerService } from './solo-player.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
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
    possibleWords: string[] = [];
    possibilityOfPlayWord: string[] = [];
    allRetainedOptions: LetterPlacementPossibility[] = [];
    firstWordToPlay: boolean = false;
    private messageSource = new BehaviorSubject('default message');
    private messageSoloPlayer = new BehaviorSubject(['turn', 'last turn was a skip']);
    private sourceMessageTextBox = new BehaviorSubject([' ', ' ']);
    private placementPossibilities: LetterPlacementPossibility[] = [];
    private possibilityCheck: PossibilityChecker = new PossibilityChecker(true);
    private soloOpponentFunctions: SoloOpponentUsefulFunctions;
    constructor(
        private letters: LetterService,
        private timeManager: TimerTurnManagerService,
        private soloPlayer: SoloPlayerService,
        private gameState: GameStateService,
        private placeLetters: PlaceLettersService,
        private injection: Injector,
    ) {
        this.soloOpponentFunctions = new SoloOpponentUsefulFunctions(true);
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
        this.myTurn = this.timeManager.turn === 1;
    }
    play() {
        this.myTurn = this.timeManager.turn === 1;
        if (this.myTurn === true) {
            const HUNDRED = 100;
            const TWENTY = 20;
            const PROBABILITY_OF_ACTION = this.calculateProbability(HUNDRED);
            const TIME_OUT_TIME = 3500;
            if (PROBABILITY_OF_ACTION > TWENTY) {
                // play a word
                this.allRetainedOptions = [];
                this.possibleWords = [];
                this.placementPossibilities = [];
                const PROBABILITY_OF_POINTS = this.calculateProbability(HUNDRED);
                const FORTY = 40;
                const SEVENTY = 70;
                const SIX = 6;
                const SEVEN = 7;
                const TWELVE = 12;
                const THIRTEEN = 13;
                const EIGHTEEN = 18;
                if (!this.firstWordToPlay) {
                    this.findValidPlacesOnBoard();
                    if (PROBABILITY_OF_POINTS <= FORTY) {
                        this.findWordsToPlay(0, SIX);
                    } else if (PROBABILITY_OF_POINTS <= SEVENTY) {
                        this.findWordsToPlay(SEVEN, TWELVE);
                    } else {
                        this.findWordsToPlay(THIRTEEN, EIGHTEEN);
                    }
                } else {
                    this.playFirstWordInGame();
                    this.findWordsToPlay(0, EIGHTEEN);
                }
                let text = 'temporary message';
                let i = 0;
                while (text !== 'Mot placé avec succès.' && i < this.allRetainedOptions.length) {
                    text = this.placeLetters.placeWord(
                        this.soloOpponentFunctions.toChar(this.allRetainedOptions[i].row) +
                            this.allRetainedOptions[i].column +
                            this.soloOpponentFunctions.enumToString(this.allRetainedOptions[i].placement) +
                            ' ' +
                            this.possibleWords[i],
                    );
                    i++;
                }
                this.firstWordToPlay = false;
                this.myTurn = false;
                this.placementPossibilities = [];
                this.changeTurn(this.myTurn.toString());
                this.timeManager.endTurn();
            } else {
                setTimeout(() => {
                    const TEN = 10;
                    if (PROBABILITY_OF_ACTION <= TEN) {
                        // skip turn
                        this.skipTurn();
                    } else if (PROBABILITY_OF_ACTION <= TWENTY) {
                        // trade letters
                        const NUMBER_OF_LETTERS_TO_TRADE = this.calculateProbability(this.letters.players[1].allLettersInHand.length);
                        if (NUMBER_OF_LETTERS_TO_TRADE <= PlayerLetterHand.allLetters.length) {
                            this.exchangeLetters(NUMBER_OF_LETTERS_TO_TRADE);
                        } else {
                            this.skipTurn();
                        }
                    }
                }, TIME_OUT_TIME);
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
        this.myTurn = parseInt(this.messageTimeManager, 10) === 1;
    }
    reset() {
        this.letters.players[1].allLettersInHand = [];
        this.numberOfLetters = this.letters.players[1].numberLetterInHand = 0;
        this.letters.players[1].addLetters(MAXLETTERINHAND);
        this.numberOfLetters = parseInt(this.message, 10);
        this.valueToEndGame = 0;
        this.firstWordToPlay = true;
    }
    getScore() {
        return this.score;
    }
    sendNumberOfSkippedTurn() {
        this.messageSource.next(this.valueToEndGame.toString());
    }
    skipTurn() {
        this.myTurn = this.timeManager.turn === 1;
        if (this.myTurn === true) {
            this.incrementPassedTurns();
            this.messageSoloPlayer.next([this.valueToEndGame.toString(), this.lastTurnWasASkip.toString()]);
            this.timeManager.endTurn();
            const numberOfLetters = 0;
            this.sourceMessageTextBox.next(['!passer', numberOfLetters.toString()]);
        }
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
        this.sourceMessageTextBox.next(['!échanger ', numberOfLettersToTrade.toString()]);
    }
    findWordsToPlay(minPointValue: number, maxPointValue: number) {
        const allWords: string[] = this.placeLetters.getDictionary();
        let lettersInString = '';
        let otherLettersRow = '';
        let otherLettersColumn = '';
        for (const letter of this.letters.players[1].allLettersInHand) {
            lettersInString += letter.letter.toLowerCase();
        }
        for (const item of this.placementPossibilities) {
            otherLettersColumn += item.letter.toLowerCase();
            otherLettersRow += item.letter.toLowerCase();
            if (!this.firstWordToPlay) {
                otherLettersColumn += this.findSameColumnItems(item.row, item.column);
                otherLettersRow += this.findSameRowItems(item.row, item.column);
            }
            this.iterateWords(allWords, item, lettersInString, otherLettersRow, otherLettersColumn);
            otherLettersColumn = '';
            otherLettersRow = '';
        }
        this.eliminateWordsToMatchScore(minPointValue, maxPointValue);
    }
    findSameColumnItems(row: number, column: number) {
        let columnLetters = '';
        for (let i = row + 1; i < NUMBEROFCASE; i++) {
            if (this.gameState.lettersOnBoard[i][column] !== '') {
                columnLetters += this.gameState.lettersOnBoard[i][column].toLowerCase();
            } else {
                columnLetters += ' ';
            }
        }
        return columnLetters;
    }
    findSameRowItems(row: number, column: number) {
        let rowLetters = '';
        for (let i = column + 1; i < NUMBEROFCASE; i++) {
            if (this.gameState.lettersOnBoard[row][i] !== '') {
                rowLetters += this.gameState.lettersOnBoard[row][i].toLocaleLowerCase();
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
                this.possibleWords.splice(i, 1);
                this.allRetainedOptions.splice(i, 1);
                i -= 1;
            }
        }
    }
    iterateWords(allWords: string[], item: LetterPlacementPossibility, lettersInString: string, rowLetters: string, columnLetters: string) {
        const NOT_PRESENT = -1;
        for (const word of allWords) {
            const itemHolder = item;
            let indexOfLetter = 0;
            if ((indexOfLetter = word.search(itemHolder.letter.toLowerCase())) !== NOT_PRESENT) {
                let possibleWord = false;
                let temporaryWord = word;
                for (let i = 0; i < lettersInString.length; i++) {
                    if (temporaryWord.search(lettersInString.charAt(i)) !== NOT_PRESENT) {
                        possibleWord = true;
                        temporaryWord = temporaryWord.replace(lettersInString.charAt(i), ' ');
                    } else if (lettersInString.charAt(i) === '*') {
                        possibleWord = true;
                        for (let j = 0; j < temporaryWord.length; j++) {
                            if (temporaryWord.charAt(j) !== ' ') {
                                temporaryWord = temporaryWord.replace(temporaryWord.charAt(j), ' ');
                            }
                        }
                    }
                }
                let isRowsToPlace = item.column - indexOfLetter >= 0;
                let isColumnToPlace = item.row - indexOfLetter >= 0;
                if (this.firstWordToPlay) {
                    isColumnToPlace = isRowsToPlace &&= temporaryWord.split(' ').join('').length === 0;
                }
                if (possibleWord && !this.firstWordToPlay) {
                    isRowsToPlace &&= this.soloOpponentFunctions.checkRowsAndColumnsForWordMatch(rowLetters, temporaryWord);
                    isColumnToPlace &&= this.soloOpponentFunctions.checkRowsAndColumnsForWordMatch(columnLetters, temporaryWord);
                }
                this.checkRowAndColumnAvailability(isRowsToPlace, isColumnToPlace, word, indexOfLetter, item);
            }
        }
    }
    checkRowAndColumnAvailability(
        isRowsToPlace: boolean,
        isColumnToPlace: boolean,
        word: string,
        indexOfLetter: number,
        item: LetterPlacementPossibility,
    ) {
        if (isRowsToPlace) {
            const possibility: LetterPlacementPossibility = {
                letter: word.charAt(0).toLowerCase(),
                row: item.row,
                column: item.column - indexOfLetter,
                placement: item.column - indexOfLetter === item.column ? PlacementValidity.Right : PlacementValidity.Left,
            };
            this.addLetterAndWord(word, possibility);
        }
        if (isColumnToPlace) {
            const possibility: LetterPlacementPossibility = {
                letter: word.charAt(0).toLowerCase(),
                row: item.row - indexOfLetter,
                column: item.column,
                placement: item.row - indexOfLetter === item.row ? PlacementValidity.HDown : PlacementValidity.HUp,
            };
            this.addLetterAndWord(word, possibility);
        }
    }
    addLetterAndWord(word: string, possibility: LetterPlacementPossibility) {
        this.allRetainedOptions.push(possibility);
        this.possibleWords.push(word);
    }
    sendTradedLettersInformation(numberOfLettersToTrade: number) {
        this.sourceMessageTextBox.next(['!échanger ', numberOfLettersToTrade.toString()]);
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
                        this.placementPossibilities.push(possibility);
                    }
                }
            }
        }
    }
    playFirstWordInGame() {
        for (const letter of this.letters.players[1].allLettersInHand) {
            const possibility: LetterPlacementPossibility = {
                row: CENTERCASE - 1,
                column: CENTERCASE - 1,
                letter: letter.letter,
                placement: PlacementValidity.Right,
            };
            this.placementPossibilities.push(possibility);
            this.placementPossibilities.push(possibility);
        }
    }
}
