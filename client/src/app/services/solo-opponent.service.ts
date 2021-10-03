import { Injectable } from '@angular/core';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND } from '@app/constants';
import { SoloOpponent2Service } from '@app/services/solo-opponent2.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { LetterService } from './letter.service';
import { SoloPlayerService } from './solo-player.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
@Injectable({
    providedIn: 'root',
})
export class SoloOpponentService {
    message: string;
    messageTimeManager: string;
    subscription: Subscription;
    messageFromSoloPlayer: string[];
    subscriptionTimeManager: Subscription;
    subscriptionSoloPlayer: Subscription;
    myTurn: boolean;
    valueToEndGame: number = 0;
    maximumAllowedSkippedTurns: number;
    numberOfLetters: number = 0;
    messageTextBox: Observable<string[]>;
    score: number = 0;
    currentMessage: Observable<string>;
    lastTurnWasASkip: boolean = false;
    firstWordToPlay: boolean = false;
    lastCommandEntered: string = 'Bonjour joueur!';
    messageSource = new BehaviorSubject('default message');
    messageSoloPlayer = new BehaviorSubject(['turn', 'last turn was a skip']);
    sourceMessageTextBox = new BehaviorSubject([' ', ' ']);
    constructor(
        public letters: LetterService,
        public timeManager: TimerTurnManagerService,
        public soloPlayer: SoloPlayerService,
        public soloOpponent2: SoloOpponent2Service,
    ) {
        this.subscription = PlayerLetterHand.currentMessage.subscribe((message) => (this.message = message));
        this.currentMessage = this.messageSource.asObservable();
        this.letters.players[1].addLetters(MAXLETTERINHAND);
        this.numberOfLetters = parseInt(this.message, 10);
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.subscriptionSoloPlayer = this.soloPlayer.currentMessageToSoloOpponent.subscribe(
            (messageFromSoloPlayer) => (this.messageFromSoloPlayer = messageFromSoloPlayer),
        );
        this.messageTextBox = this.sourceMessageTextBox.asObservable();
        this.maximumAllowedSkippedTurns = 6;
        this.myTurn = this.timeManager.turn === 1;
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
            } else if (PROBABILITY_OF_ACTION <= TEN) {
                this.skipTurn();
            } else {
                const NUMBER_OF_LETTERS_TO_TRADE = this.calculateProbability(this.letters.players[1].allLettersInHand.length);
                if (NUMBER_OF_LETTERS_TO_TRADE <= SEVEN) {
                    this.exchangeLetters(NUMBER_OF_LETTERS_TO_TRADE);
                } else {
                    this.skipTurn();
                }
            }
        }
    }
    calculateProbability(percentage: number) {
        return Math.floor(Math.random() * percentage);
    }

    changeTurn(message: string) {
        this.messageSource.next(message);
        this.myTurn = parseInt(this.messageTimeManager, 10) === 1;
    }
    reset() {
        this.letters.players[1].allLettersInHand = [];
        this.numberOfLetters = this.letters.players[1].numberLetterInHand = 0;
        this.letters.players[1].addLetters(MAXLETTERINHAND);
        this.numberOfLetters = parseInt(this.message, 10);
        this.valueToEndGame = 0;
        this.firstWordToPlay = true;
    }

    sendNumberOfSkippedTurn() {
        this.messageSource.next(this.valueToEndGame.toString());
    }
    skipTurn() {
        if (this.timeManager.turn === 1) {
            this.timeManager.endTurn('skip');
            const numberOfLetters = 0;
            this.sourceMessageTextBox.next(['!passer', numberOfLetters.toString()]);
            this.lastCommandEntered = '!passer';
        }
    }
    exchangeLetters(numberOfLettersToTrade: number) {
        this.lastTurnWasASkip = false;
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
        this.timeManager.endTurn('exchange');
        this.sourceMessageTextBox.next(['!échanger ', numberOfLettersToTrade.toString()]);
        this.lastCommandEntered = '!échanger ' + numberOfLettersToTrade.toString();
    }
}
