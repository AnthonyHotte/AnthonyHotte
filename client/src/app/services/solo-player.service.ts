// https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { TimerTurnManagerService } from './timer-turn-manager.service';
import { LetterService } from './letter.service';
import { MAXLETTERINHAND } from '@app/constants';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';

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
    messageSource = new BehaviorSubject('default message');
    private messageToSoloOpponent = new BehaviorSubject(['turn', 'last turn was a skip']);

    constructor(private letters: LetterService, private timeManager: TimerTurnManagerService) {
        this.currentMessage = this.messageSource.asObservable();
        this.subscription = PlayerLetterHand.currentMessage.subscribe((message) => (this.message = message));
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.currentMessageToSoloOpponent = this.messageToSoloOpponent.asObservable();
        this.maximumAllowedSkippedTurns = 6;
    }

    // message is a string 0 or 1, we pass the number of the turn of the person who just finish playing (if next turn is my turn then we pass 1)
    changeTurn(message: string) {
        this.messageSource.next(message);
        this.myTurn = parseInt(message, 10) === 0;
    }

    reset() {
        this.letters.players[0].allLettersInHand = [];
        this.numberOfLetters = this.letters.players[0].numberLetterInHand = 0;
        this.letters.players[0].addLetters(MAXLETTERINHAND);
        this.numberOfLetters = parseInt(this.message, 10);
        this.valueToEndGame = 0;
    }

    getScore() {
        return this.score;
    }

    incrementPassedTurns(numberOfSkippedTurns: number, lastTurnSkipped: boolean) {
        this.valueToEndGame = numberOfSkippedTurns;
        this.lastTurnWasASkip = lastTurnSkipped;
        // pour compter jusqu'a 6 de la part des deux joueurs.
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



    sendNumberOfSkippedTurn() {
        this.messageSource.next(this.valueToEndGame.toString());
    }
}
