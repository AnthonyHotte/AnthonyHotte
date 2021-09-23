import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GestionTimerTourService } from './gestion-timer-tour.service';
import { LetterService } from './letter.service';
import { SoloPlayerService } from './solo-player.service';

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
    private messageSource = new BehaviorSubject('default message');
    private messageSoloPlayer = new BehaviorSubject(['turn', 'last turn was a skip']);
    private sourceMessageTextBox = new BehaviorSubject([' ', ' ']);

    constructor(private letters: LetterService, private timeManager: GestionTimerTourService, private soloPlayer: SoloPlayerService) {
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
        this.currentMessage = this.messageSource.asObservable();
        this.letters.addLettersForOpponent(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.subscriptionSoloPlayer = this.soloPlayer.currentMessageToSoloOpponent.subscribe(
            (messageFromSoloPlayer) => (this.messageFromSoloPlayer = messageFromSoloPlayer),
        );
        this.messageTextBox = this.sourceMessageTextBox.asObservable();
        this.maximumAllowedSkippedTurns = 6;
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
                if (NUMBER_OF_LETTERS_TO_TRADE <= this.letters.allLetters.length) {
                    this.exchangeLetters(NUMBER_OF_LETTERS_TO_TRADE);
                } else {
                    this.skipTurn(turnToBeSkipped);
                }
            } else {
                // play a word
                const PROBABILITY_OF_POINTS = this.calculateProbability(HUNDRED);
                const FORTY = 40;
                const SEVENTY = 70;
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
        this.letters.addLettersForOpponent(this.letters.maxLettersInHand);
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
            if (!this.letters.selectedLettersForExchangeOpponent.has(i)) {
                this.letters.selectedLettersForExchangeOpponent.add(INDEX_OF_LETTER_TO_TRADE);
                i++;
            }
        }
        this.sendTradedLettersInformation(numberOfLettersToTrade);
        this.letters.exchangeLettersForOpponent();
        this.timeManager.endTurn();
    }

    findLessThanEqualToSixPointWord() {
        return 'ToDo';
    }

    findAWordForSevenToTwelvePoints() {
        return 'ToDo';
    }

    findAWordForThirteenToEighteenPoints() {
        return 'ToDO';
    }

    sendTradedLettersInformation(numberOfLettersToTrade: number) {
        this.sourceMessageTextBox.next(['!échanger', numberOfLettersToTrade.toString()]);
    }
}
