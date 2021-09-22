// https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { GestionTimerTourService } from './gestion-timer-tour.service';
import { LetterService } from './letter.service';

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
    currentMessageToSoloOpponent: Observable<string[]>;
    numberOfLetters: number = 0;
    score: number = 0;
    lastTurnWasASkip: boolean = false;
    private messageSource = new BehaviorSubject('default message');
    private messageToSoloOpponent = new BehaviorSubject(['turn', 'last turn was a skip']);

    constructor(private letters: LetterService, private timeManager: GestionTimerTourService) {
        this.currentMessage = this.messageSource.asObservable();
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.currentMessageToSoloOpponent = this.messageToSoloOpponent.asObservable();
        this.maximumAllowedSkippedTurns = 6;
    }

    play() {
        this.myTurn = parseInt(this.messageTimeManager, 10) === 0;
        if (this.myTurn === true) {
            return 'ToDo';
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

    incrementPassedTurns(valueOfSkippedTurn: number, lastTurnSkipped: boolean) {
        this.lastTurnWasASkip = lastTurnSkipped;
        this.valueToEndGame = valueOfSkippedTurn;
        if (this.lastTurnWasASkip) {
            this.valueToEndGame++;
        } else {
            this.valueToEndGame = 1;
            this.lastTurnWasASkip = true;
        }
        this.myTurn = false;
        this.messageToSoloOpponent.next([this.valueToEndGame.toString(), this.lastTurnWasASkip.toString()]);
        this.changeTurn(this.myTurn.toString());
    }

    exchangeLetters() {
        this.letters.exchangeLettersForPlayer();
    }

    sendNumberOfSkippedTurn() {
        this.messageSource.next(this.valueToEndGame.toString());
    }
}
