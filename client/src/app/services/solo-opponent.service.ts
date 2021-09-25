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
                if (PROBABILITY_OF_POINTS <= FORTY) {
                    this.findLessThanEqualToSixPointWord();
                } else if (PROBABILITY_OF_POINTS <= SEVENTY) {
                    this.findAWordForSevenToTwelvePoints();
                } else {
                    this.findAWordForThirteenToEighteenPoints();
                }
            }
        }

        return 'ToDO';
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

    findWordToPlay() {
        const SIX_VALUE = 6;
        for (const item of this.placementPossibilities.values()) {
            
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
            if (this.gameState.lettersOnBoard[i][j- 1] === '') {
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
