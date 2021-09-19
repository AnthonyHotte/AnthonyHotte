// https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LetterService } from './letter.service';
import { GestionTimerTourService } from './gestion-timer-tour.service';

@Injectable({
    providedIn: 'root',
})
export class SoloPlayerService {
    message: string;
    messageTimeManager: string;
    subscription: Subscription;
    subscriptionTimeManager: Subscription;
    myTurn: boolean;
    valueToEndGame: number = 0;
    maximumAllowedSkippedTurns: number;
    currentMessage: Observable<string>;
    numberOfLetters: number = 0;
    score: number = 0;
    lastTurnWasASkip: boolean = false;
    private messageSource = new BehaviorSubject('default message');

    constructor(private letters: LetterService, private timeManager: GestionTimerTourService) {
        this.currentMessage = this.messageSource.asObservable();
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.maximumAllowedSkippedTurns = 5;
    }

    play() {
        this.myTurn = parseInt(this.message, 10) === 0;
        if (this.myTurn === true) {
            return 'ToDO';
        }
        return 'ToDO';
    }

    changeTurn(message: string) {
        this.messageSource.next(message);
        this.myTurn = parseInt(this.message, 10) === 0;
    }

    reset() {
        this.letters.addLettersForPlayer(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
        this.valueToEndGame = 0;
    }

    getScore() {
        return this.score;
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

    exchangeLetters() {
        this.letters.exchangeLettersForPlayer();
    }

    sendNumberOfSkippedTurn() {
        this.messageSource.next(this.valueToEndGame.toString());
    }
}
