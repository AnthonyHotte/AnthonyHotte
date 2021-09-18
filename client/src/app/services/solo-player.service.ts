// https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LetterService } from './letter.service';

@Injectable({
    providedIn: 'root',
})
export class SoloPlayerService {
    message: string;
    subscription: Subscription;
    myTurn: boolean;
    valueToEndGame: number;
    maximumAllowedSkippedTurns: number = 3;
    currentMessage: Observable<string>;
    numberOfLetters: number = 0;
    score: number = 0;
    private messageSource = new BehaviorSubject('default message');

    constructor(private letters: LetterService) {
        this.currentMessage = this.messageSource.asObservable();
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
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
    }

    reset() {
        this.letters.addLettersForPlayer(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
    }

    getScore() {
        return this.score;
    }

    incrementPassedTurns() {
        this.valueToEndGame++;
    }
}
