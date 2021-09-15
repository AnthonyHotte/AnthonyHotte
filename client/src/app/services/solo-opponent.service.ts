import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { LetterService } from './letter.service';

@Injectable({
  providedIn: 'root'
})

export class SoloOpponentService {

    message: string;
    subscription: Subscription;
    myTurn: boolean;
    valueToEndGame: number;
    maximumAllowedSkippedTurns: number = 3;
    numberOfLetters: number = 0;
    private messageSource = new BehaviorSubject('default message');
    currentMessage = this.messageSource.asObservable();

    constructor(private letters: LetterService) {
        this.subscription = this.letters.currentMessage.subscribe((message) => (this.message = message));
        this.letters.addLettersForOpponent(this.letters.MAXLETTERSINHAND);
        this.numberOfLetters = parseInt(this.message);
    }

    play() {
      this.myTurn = parseInt(this.message) === 1;
      if (this.myTurn === true) {
      }
    }

    changeTurn(message: string) {
      this.messageSource.next(message)
    }
}
