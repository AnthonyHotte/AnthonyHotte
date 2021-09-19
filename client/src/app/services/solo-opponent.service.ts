import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LetterService } from './letter.service';

@Injectable({
    providedIn: 'root',
})
export class SoloOpponentService {
    message: string;
    subscription: Subscription;
    currentMessageSoloPlayer: Observable<string>;
    myTurn: boolean;
    valueToEndGame: number;
    maximumAllowedSkippedTurns: number = 3;
    numberOfLetters: number = 0;
    score: number = 0;
    currentMessage: Observable<string>;
    private messageSource = new BehaviorSubject('default message');
    private messageSoloPlayer = new BehaviorSubject('default message')

    constructor(private letters: LetterService) {
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
        this.currentMessage = this.messageSource.asObservable();
        this.currentMessageSoloPlayer = this.messageSoloPlayer.asObservable();
        this.letters.addLettersForOpponent(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
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
                let turn = 0;
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

    changeTurn(message: string) {
        this.messageSource.next(message);
    }

    reset() {
        this.letters.addLettersForOpponent(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
        this.valueToEndGame = 0;
    }

    getScore() {
        return this.score;
    }

    incrementPassedTurns() {
        this.valueToEndGame++;
    }
}
