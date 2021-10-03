import { Injectable } from '@angular/core';
import { MAXLETTERINHAND } from '@app/constants';
import { SoloOpponent2Service } from '@app/services/solo-opponent2.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FinishGameService } from './finish-game.service';
import { LetterService } from './letter.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

@Injectable({
    providedIn: 'root',
})
export class SoloOpponentService {
    messageTextBox: Observable<string[]>;
    lastCommandEntered: string = 'Bonjour joueur!';
    sourceMessageTextBox = new BehaviorSubject([' ', ' ']);
    constructor(
        public letters: LetterService,
        public timeManager: TimerTurnManagerService,
        public soloOpponent2: SoloOpponent2Service,
        public finishGameService: FinishGameService,
    ) {
        this.letters.players[1].addLetters(MAXLETTERINHAND);
        this.messageTextBox = this.sourceMessageTextBox.asObservable();
    }
    play() {
        if (this.timeManager.turn === 1) {
            const HUNDRED = 100;
            const TWENTY = 20;
            const TEN = 10;
            const SEVEN = 7;
            const PROBABILITY_OF_ACTION = this.calculateProbability(HUNDRED);
            if (PROBABILITY_OF_ACTION > TWENTY) {
                this.lastCommandEntered = this.soloOpponent2.play();
                this.endTurn('place');
            } else if (PROBABILITY_OF_ACTION <= TEN) {
                this.skipTurn();
            } else {
                const NUMBER_OF_LETTERS_TO_TRADE = this.calculateProbability(this.letters.players[1].allLettersInHand.length);
                if (NUMBER_OF_LETTERS_TO_TRADE <= SEVEN) {
                    this.exchangeLetters(NUMBER_OF_LETTERS_TO_TRADE);
                    this.endTurn('exchange');
                } else {
                    this.skipTurn();
                }
            }
        }
    }
    calculateProbability(percentage: number) {
        return Math.floor(Math.random() * percentage);
    }

    reset() {
        this.letters.players[1].allLettersInHand = [];
        this.letters.players[1].addLetters(MAXLETTERINHAND);
    }

    skipTurn() {
        if (this.timeManager.turn === 1) {
            this.endTurn('skip');
            this.sourceMessageTextBox.next(['!passer', '0']);
            this.lastCommandEntered = '!passer';
        }
    }
    exchangeLetters(numberOfLettersToTrade: number) {
        let i = 0;
        const indexLettersToExchange: number[] = [];
        while (i < numberOfLettersToTrade) {
            const INDEX_OF_LETTER_TO_TRADE = this.calculateProbability(this.letters.players[this.timeManager.turn].allLettersInHand.length);
            if (!indexLettersToExchange.includes(INDEX_OF_LETTER_TO_TRADE)) {
                indexLettersToExchange.push(INDEX_OF_LETTER_TO_TRADE);
                i++;
            }
        }
        let lettersToExchange = '';
        for (const index of indexLettersToExchange) {
            lettersToExchange += this.letters.players[this.timeManager.turn].allLettersInHand[index];
        }
        this.letters.players[this.timeManager.turn].exchangeLetters(lettersToExchange);
        this.sourceMessageTextBox.next(['!échanger ', numberOfLettersToTrade.toString()]);
        this.lastCommandEntered = '!échanger ' + numberOfLettersToTrade.toString();
    }

    endTurn(reason: string) {
        this.timeManager.endTurn(reason);
        if (this.letters.players[this.timeManager.turn].allLettersInHand.length === 0) {
            this.finishGameService.isGameFinished = true;
        }
    }
}
