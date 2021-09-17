//https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
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
    private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();
    numberOfLetters: number = 0;
    score: number = 0;

    constructor(private letters: LetterService) {
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
    }

    play() {
      this.myTurn = parseInt(this.message) === 0;
      if (this.myTurn === true) {
      }
    }

    changeTurn(message: string) {
      this.messageSource.next(message)
    }

    reset(){
      this.letters.addLettersForPlayer(this.letters.MAXLETTERSINHAND);
      this.numberOfLetters = parseInt(this.message);
    }

    getScore(){
      return this.score;
    }
}
