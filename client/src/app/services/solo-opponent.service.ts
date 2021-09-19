import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GestionTimerTourService } from './gestion-timer-tour.service';
import { LetterService } from './letter.service';

@Injectable({
    providedIn: 'root',
})
export class SoloOpponentService {
    message: string;
    messageTimeManager: string;
    subscription: Subscription;
    currentMessageSoloPlayer: Observable<string>;
    subscriptionTimeManager: Subscription;
    myTurn: boolean;
    valueToEndGame: number = 0;
    maximumAllowedSkippedTurns: number;
    numberOfLetters: number = 0;
    score: number = 0;
    currentMessage: Observable<string>;
    lastTurnWasASkip: boolean = false;
    private messageSource = new BehaviorSubject('default message');
    private messageSoloPlayer = new BehaviorSubject('default message');

    constructor(private letters: LetterService, private timeManager: GestionTimerTourService) {
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
        this.currentMessage = this.messageSource.asObservable();
        this.currentMessageSoloPlayer = this.messageSoloPlayer.asObservable();
        this.letters.addLettersForOpponent(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.maximumAllowedSkippedTurns = 5;
    }

    play() {
        this.myTurn = parseInt(this.message, 10) === 1;
        if (this.myTurn === true) {
            const probabilityOfAction = this.calculateProbability();
            const TEN = 10;
            const TWENTY = 20;
            if (probabilityOfAction <= TEN) {
                this.incrementPassedTurns();
                this.myTurn = false;
                const turn = 0;
                this.changeTurn(turn.toString());
                this.messageSoloPlayer.next(this.valueToEndGame.toString());
            } else if (probabilityOfAction <= TWENTY) {
            } else {
            }
        }

        return 'ToDO';
    }

    calculateProbability() {
        const percentage = 100;
        return Math.floor(Math.random() * percentage);
    }

    incrementPassedTurns() {
        if (this.lastTurnWasASkip) {
            this.valueToEndGame++;
        } else {
            this.valueToEndGame = 1;
        }
        this.myTurn = false;
        this.changeTurn(this.myTurn.toString());
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
}
