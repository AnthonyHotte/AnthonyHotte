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
    lastCommandEntered: string = 'Bonjour joueur!';
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
            const SEVEN = 7;
            const PROBABILITY_OF_ACTION = this.calculateProbability(HUNDRED);
            if (PROBABILITY_OF_ACTION > TWENTY) {
                this.allRetainedOptions = [];
                this.possibleWords = [];
                this.placementPossibilities = [];
                const PROBABILITY_OF_POINTS = this.calculateProbability(HUNDRED);
                const FORTY = 40;
                const SEVENTY = 70;
                const SIX = 6;
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
                while (i < this.allRetainedOptions.length) {
                    text = this.placeLetters.placeWord(
                        this.soloOpponentFunctions.toChar(this.allRetainedOptions[i].row) +
                            (this.allRetainedOptions[i].column + 1) +
                            this.soloOpponentFunctions.enumToString(this.allRetainedOptions[i].placement) +
                            ' ' +
                            this.possibleWords[i],
                    );
                    this.lastCommandEntered =
                        '!placer ' +
                        this.soloOpponentFunctions.toChar(this.allRetainedOptions[i].row) +
                        (this.allRetainedOptions[i].column + 1) +
                        this.soloOpponentFunctions.enumToString(this.allRetainedOptions[i].placement) +
                        ' ' +
                        this.possibleWords[i] +
                        ' placements alternatifs: ' +
                        this.possibleWords[this.calculateProbability(this.possibleWords.length)] +
                        ' ' +
                        this.possibleWords[this.calculateProbability(this.possibleWords.length)] +
                        ' ' +
                        this.possibleWords[this.calculateProbability(this.possibleWords.length)];
                    i++;
                    if (text === 'Mot placé avec succès.') {
                        i = this.allRetainedOptions.length;
                    }
                }
                this.firstWordToPlay = false;
                this.myTurn = false;
                this.changeTurn(this.myTurn.toString());
                this.timeManager.endTurn();
            } else {
                const TEN = 10;
                if (PROBABILITY_OF_ACTION <= TEN) {
                    this.skipTurn();
                } else if (PROBABILITY_OF_ACTION <= TWENTY) {
                    const NUMBER_OF_LETTERS_TO_TRADE = this.calculateProbability(this.letters.players[1].allLettersInHand.length);
                    if (NUMBER_OF_LETTERS_TO_TRADE <= SEVEN) {
                        this.exchangeLetters(NUMBER_OF_LETTERS_TO_TRADE);
                    } else {
                        this.skipTurn();
                    }
                }
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
            this.lastCommandEntered = '!passer';
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
        this.lastCommandEntered = '!échanger ' + numberOfLettersToTrade.toString();
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
                for (let i = item.row + 1; i < NUMBEROFCASE; i++) {
                    if (this.gameState.lettersOnBoard[i][item.column] !== '') {
                        otherLettersColumn += this.gameState.lettersOnBoard[i][item.column].toLowerCase();
                    }
                }
                for (let i = item.column + 1; i < NUMBEROFCASE; i++) {
                    if (this.gameState.lettersOnBoard[item.row][i] !== '') {
                        otherLettersRow += this.gameState.lettersOnBoard[item.row][i].toLowerCase();
                    }
                }
            }

            const TWENTY = 10;

            if (this.allRetainedOptions.length <= TWENTY) {
                this.iterateWords(allWords, item, lettersInString, otherLettersRow, otherLettersColumn);
                this.eliminateWordsToMatchScore(minPointValue, maxPointValue);
            }
            otherLettersColumn = '';
            otherLettersRow = '';
        }
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
            let indexOfLetter = 0;
            if ((indexOfLetter = word.search(item.letter.toLowerCase())) !== NOT_PRESENT) {
                let isRowsToPlace = item.column - indexOfLetter >= 0;
                let isColumnToPlace = item.row - indexOfLetter >= 0;
                let possibleWord = false;
                let temporaryWordRow = word;
                let temporaryWordColumn = word;
                if (word.search(rowLetters) !== NOT_PRESENT) {
                    temporaryWordRow = temporaryWordRow.replace(rowLetters, '');
                    isRowsToPlace &&= true;
                }
                if (word.search(columnLetters) !== NOT_PRESENT) {
                    temporaryWordColumn = temporaryWordColumn.replace(columnLetters, '');
                    isColumnToPlace &&= true;
                }
                for (let i = 0; i < lettersInString.length; i++) {
                    if (temporaryWordRow.search(lettersInString.charAt(i)) !== NOT_PRESENT) {
                        temporaryWordRow = temporaryWordRow.replace(lettersInString.charAt(i), '');
                        isRowsToPlace &&= true;
                        possibleWord = true;
                    }
                    if (temporaryWordColumn.search(lettersInString.charAt(i)) !== NOT_PRESENT) {
                        temporaryWordColumn = temporaryWordColumn.replace(lettersInString.charAt(i), '');
                        isColumnToPlace &&= true;
                        possibleWord = true;
                    }
                }
                isRowsToPlace &&= temporaryWordRow.length === 0;
                isColumnToPlace &&= temporaryWordColumn.length === 0;
                this.checkRowAndColumnAvailability(possibleWord, isRowsToPlace, isColumnToPlace, word, indexOfLetter, item);
            }
        }
    }
    checkRowAndColumnAvailability(
        possibleWord: boolean,
        isRowsToPlace: boolean,
        isColumnToPlace: boolean,
        word: string,
        indexOfLetter: number,
        item: LetterPlacementPossibility,
    ) {
        isRowsToPlace &&= possibleWord;
        isColumnToPlace &&= possibleWord;
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
        const TOO_MUCH = 7;
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                if (this.gameState.lettersOnBoard[i][j] !== '') {
                    let possibility = { row: i, column: j, letter: this.gameState.lettersOnBoard[i][j], placement: PlacementValidity.Nothing };
                    possibility = this.possibilityCheck.checkAll(this.gameState.lettersOnBoard, i, j, possibility);
                    if (possibility.placement !== PlacementValidity.Nothing && this.placementPossibilities.length <= TOO_MUCH) {
                        this.placementPossibilities.push(possibility);
                    }
                }
            }
        }
    }
    playFirstWordInGame() {
        for (const letter of this.letters.players[1].allLettersInHand) {
            const possibility1: LetterPlacementPossibility = {
                row: CENTERCASE - 1,
                column: CENTERCASE - 1,
                letter: letter.letter,
                placement: PlacementValidity.Right,
            };
            this.placementPossibilities.push(possibility1);
            possibility1.placement = PlacementValidity.HDown;
            this.placementPossibilities.push(possibility1);
        }
    }
}
