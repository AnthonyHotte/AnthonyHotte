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
    subscriptionTimeManager: Subscription;
    myTurn: boolean;
    valueToEndGame: number = 0;
    maximumAllowedSkippedTurns: number = 3;
    numberOfLetters: number = 0;
    score: number = 0;
    currentMessage: Observable<string>;
    private messageSource = new BehaviorSubject('default message');

    constructor(private letters: LetterService, private timeManager: GestionTimerTourService) {
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
        this.currentMessage = this.messageSource.asObservable();
        this.letters.addLettersForOpponent(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
    }

    play() {
        this.myTurn = parseInt(this.message, 10) === 1;
        if (this.myTurn === true) {
            return 'ToDo';
        }

        return 'ToDO';
    }

    incrementPassedTurns() {
        this.valueToEndGame++;
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
