import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LetterService } from './letter.service';

@Injectable({
    providedIn: 'root',
})
export class SoloOpponentService {
    message: string;
    subscription: Subscription;
    myTurn: boolean;
    valueToEndGame: number;
    maximumAllowedSkippedTurns: number = 3;
    numberOfLetters: number = 0;
    score: number = 0;
    currentMessage: Observable<string>;
    private messageSource = new BehaviorSubject('default message');

    constructor(private letters: LetterService) {
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
        this.currentMessage = this.messageSource.asObservable();
        this.letters.addLettersForOpponent(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
    }

    play() {
        this.myTurn = parseInt(this.message, 10) === 1;
        if (this.myTurn === true) {
            return 'ToDo';
        }

        return 'ToDO';
    }

    changeTurn(message: string) {
        this.messageSource.next(message);
    }

    reset() {
        this.letters.addLettersForOpponent(this.letters.maxLettersInHand);
        this.numberOfLetters = parseInt(this.message, 10);
    }

    getScore() {
        return this.score;
    }
}
