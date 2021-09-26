import { Injectable, Injector } from '@angular/core';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND, NUMBEROFCASE } from '@app/constants';
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
    private messageSource = new BehaviorSubject('default message');
    private messageSoloPlayer = new BehaviorSubject(['turn', 'last turn was a skip']);
    private sourceMessageTextBox = new BehaviorSubject([' ', ' ']);
    private placementPossibilities = new Set<LetterPlacementPossibility>();

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

    // need to include possibility of letters on same line or same column like lxl where player has only o and no l so he can play lol...
    findWordsToPlay(minPointValue: number, maxPointValue: number) {
        const parser = dictionary.toString();
        const jsonObject = JSON.parse(parser);
        const allWords: string[] = jsonObject.words;
        const NOT_PRESENT = -1;
        let lettersInString: string;
        lettersInString = '';
        for (let i = 0; i < this.numberOfLetters; i++) {
            lettersInString += this.letters.players[1].allLettersInHand[i].letter.toLowerCase();
        }
        for (const item of this.placementPossibilities.values()) {
            this.iterateWords(allWords, item.letter.toLowerCase());
        }
        for (let i = 0; i < this.possibleWords.length; i++) {
            for (let j = 0; this.possibleWords[i].length; j++) {
                if (this.letters.players[1].allLettersInHand.length >= this.possibleWords[i].length) {
                    if (lettersInString.search(this.possibleWords[i].charAt(j)) === NOT_PRESENT) {
                        j = this.possibleWords[i].length;
                        this.possibleWords.slice(i);
                        i -= 1;
                    }
                } else {
                    j = this.possibleWords[i].length;
                    this.possibleWords.slice(i);
                    i -= 1;
                }
            }
        }
        this.eliminateWordsToMatchScore(minPointValue, maxPointValue);
    }

    eliminateWordsToMatchScore(minPointValue: number, maxPointValue: number) {
        const NOT_PRESENT = -1;
        for (let i = 0; i < this.possibleWords.length; i++) {
            let score = 0;
            for (const letter of LETTERS) {
                if (this.possibleWords[i].search(letter.letter.toLowerCase()) !== NOT_PRESENT) {
                    score += letter.point;
                }
            }
            if (score < minPointValue || score > maxPointValue) {
                this.possibleWords.slice(i);
                i -= 1;
            }
        }
    }

    iterateWords(allWords: string[], char: string) {
        const NOT_PRESENT = -1;
        for (const word of allWords) {
            if (word.search(char) !== NOT_PRESENT) {
                this.possibleWords.push(word);
            }
        }
    }

    sendTradedLettersInformation(numberOfLettersToTrade: number) {
        this.sourceMessageTextBox.next(['!échanger', numberOfLettersToTrade.toString()]);
    }

    findValidPlacesOnBoard() {
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                if (this.gameState.lettersOnBoard[i][j] !== '') {
                    let possibility = { row: i, column: j, letter: this.gameState.lettersOnBoard[i][j], placement: PlacementValidity.Nothing };
                    possibility = this.checkRight(i, j, possibility);
                    possibility = this.checkLeft(i, j, possibility);
                    possibility = this.checkDown(i, j, possibility);
                    possibility = this.checkUp(i, j, possibility);
                    if (possibility.placement !== PlacementValidity.Nothing) {
                        this.placementPossibilities.add(possibility);
                    }
                }
            }
        }
    }

    checkRight(i: number, j: number, possibility: LetterPlacementPossibility) {
        if (i !== NUMBEROFCASE - 1) {
            if (this.gameState.lettersOnBoard[i + 1][j] === '') {
                possibility.placement = PlacementValidity.Right;
            }
        }
        return possibility;
    }

    checkLeft(i: number, j: number, possibility: LetterPlacementPossibility) {
        if (i !== 0) {
            if (this.gameState.lettersOnBoard[i - 1][j] === '') {
                if (possibility.placement === PlacementValidity.Right) {
                    possibility.placement = PlacementValidity.LeftRight;
                } else {
                    possibility.placement = PlacementValidity.Left;
                }
            }
        }
        return possibility;
    }

    checkDown(i: number, j: number, possibility: LetterPlacementPossibility) {
        if (j !== NUMBEROFCASE - 1) {
            if (this.gameState.lettersOnBoard[i][j + 1] === '') {
                switch (possibility.placement) {
                    case PlacementValidity.Right: {
                        possibility.placement = PlacementValidity.HDownRight;

                        break;
                    }
                    case PlacementValidity.LeftRight: {
                        possibility.placement = PlacementValidity.HDownLeftRight;

                        break;
                    }
                    case PlacementValidity.Left: {
                        possibility.placement = PlacementValidity.HDownLeft;

                        break;
                    }
                    default: {
                        possibility.placement = PlacementValidity.HDown;
                    }
                }
            }
        }
        return possibility;
    }

    checkUp(i: number, j: number, possibility: LetterPlacementPossibility) {
        if (j !== 0) {
            if (this.gameState.lettersOnBoard[i][j - 1] === '') {
                switch (possibility.placement) {
                    case PlacementValidity.Right:
                        possibility.placement = PlacementValidity.HUpRight;
                        break;
                    case PlacementValidity.Left:
                        possibility.placement = PlacementValidity.HUpLeft;
                        break;
                    case PlacementValidity.LeftRight:
                        possibility.placement = PlacementValidity.HUpLeftRight;
                        break;
                    case PlacementValidity.HUp:
                        possibility.placement = PlacementValidity.HUpHDown;
                        break;
                    case PlacementValidity.HUpLeft:
                        possibility.placement = PlacementValidity.HUpHDownLeft;
                        break;
                    case PlacementValidity.HUpRight:
                        possibility.placement = PlacementValidity.HUpHDownRight;
                        break;
                    default:
                        possibility.placement = PlacementValidity.HUp;
                }
            }
        }
        return possibility;
    }
}
