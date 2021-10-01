import { Injectable } from '@angular/core';
import { LetterPlacementPossibility } from '@app/classes/letter-placement-possibility';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND } from '@app/constants';
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
    possibleWords: string[] = [];
    possibilityOfPlayWord: string[] = [];
    allRetainedOptions: LetterPlacementPossibility[] = [];
    firstWordToPlay: boolean = false;
    lastCommandEntered: string = 'Bonjour joueur!';
    private messageSource = new BehaviorSubject('default message');
    private messageSoloPlayer = new BehaviorSubject(['turn', 'last turn was a skip']);
    private sourceMessageTextBox = new BehaviorSubject([' ', ' ']);
    constructor(private letters: LetterService, private timeManager: TimerTurnManagerService, private soloPlayer: SoloPlayerService) {
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
        this.myTurn = this.timeManager.turn === 1;
        if (this.myTurn === true) {
            const HUNDRED = 100;
            const TWENTY = 20;
            const TEN = 10;
            const SEVEN = 7;
            const PROBABILITY_OF_ACTION = this.calculateProbability(HUNDRED);
            if (PROBABILITY_OF_ACTION > TWENTY) {
<<<<<<< HEAD
                this.lastTurnWasASkip = false;
                this.allRetainedOptions = [];
                this.possibleWords = [];
                this.placementPossibilities = [];
                const PROBABILITY_OF_POINTS = this.calculateProbability(HUNDRED);
                const FORTY = 40;
                const SEVENTY = 70;
                const SIX = 6;
                const TWELVE = 12;
                const THIRTEEN = 13;
                const EIGHTEEN = 18;
                if (!this.firstWordToPlay) {
                    // eslint-disable-next-line no-console
                    console.log('passe ici');
                    this.findValidPlacesOnBoard();
                    if (PROBABILITY_OF_POINTS <= FORTY) {
                        this.findWordsToPlay(0, SIX);
                    } else if (PROBABILITY_OF_POINTS <= SEVENTY) {
                        this.findWordsToPlay(SEVEN, TWELVE);
                    } else {
                        this.findWordsToPlay(THIRTEEN, EIGHTEEN);
                    }
                } else {
                    this.playFirstWordInGame();
                    this.findWordsToPlay(0, EIGHTEEN);
                }
                let text = 'temporary message';
                let i = 0;
                while (i < this.allRetainedOptions.length) {
                    if (this.isWordPlayable(this.possibleWords[i], this.allRetainedOptions[i])) {
                        text = this.placeLetters.placeWord(
                            this.soloOpponentFunctions.toChar(this.allRetainedOptions[i].row) +
                                (this.allRetainedOptions[i].column + 1) +
                                this.soloOpponentFunctions.enumToString(this.allRetainedOptions[i].placement) +
                                ' ' +
                                this.possibleWords[i],
                        );
                        this.lastCommandEntered =
                            '!placer ' +
                            this.soloOpponentFunctions.toChar(this.allRetainedOptions[i].row) +
                            (this.allRetainedOptions[i].column + 1) +
                            this.soloOpponentFunctions.enumToString(this.allRetainedOptions[i].placement) +
                            ' ' +
                            this.possibleWords[i] +
                            ' placements alternatifs: ' +
                            this.possibleWords[this.calculateProbability(this.possibleWords.length)] +
                            ' ' +
                            this.possibleWords[this.calculateProbability(this.possibleWords.length)] +
                            ' ' +
                            this.possibleWords[this.calculateProbability(this.possibleWords.length)];
                    }
                    i++;
                    if (text === 'Mot placé avec succès.') {
                        i = this.allRetainedOptions.length;
                    }
                }
                if (text === 'Mot placé avec succès.') {
                    this.firstWordToPlay = false;
                    this.myTurn = false;
                    this.changeTurn(this.myTurn.toString());
                    this.timeManager.endTurn();
                } else {
                    this.skipTurn();
                }
=======
                this.lastCommandEntered = 'Solo Opponent joue un tour';
                this.timeManager.endTurn();
            } else if (PROBABILITY_OF_ACTION <= TEN) {
                this.skipTurn();
>>>>>>> f8634b83b1e91515e2164a4a41b1f6462672f776
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
    incrementPassedTurns() {
        this.valueToEndGame = parseInt(this.messageFromSoloPlayer[0], 10);
        this.lastTurnWasASkip = this.messageFromSoloPlayer[1] === 'true';
        if (this.valueToEndGame < this.maximumAllowedSkippedTurns) {
            if (this.lastTurnWasASkip) {
                this.valueToEndGame++;
            } else {
                this.valueToEndGame = 1;
                this.lastTurnWasASkip = true;
            }
            this.myTurn = false;
            this.changeTurn(this.myTurn.toString());
        }
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
    getScore() {
        return this.score;
    }
    sendNumberOfSkippedTurn() {
        this.messageSource.next(this.valueToEndGame.toString());
    }
    skipTurn() {
        this.myTurn = this.timeManager.turn === 1;
        if (this.myTurn === true) {
            this.incrementPassedTurns();
            this.messageSoloPlayer.next([this.valueToEndGame.toString(), this.lastTurnWasASkip.toString()]);
            this.timeManager.endTurn();
            const numberOfLetters = 0;
            this.sourceMessageTextBox.next(['!passer', numberOfLetters.toString()]);
            this.lastCommandEntered = '!passer';
        }
    }
    exchangeLetters(numberOfLettersToTrade: number) {
        this.lastTurnWasASkip = false;
        let i = 0;
        while (i < numberOfLettersToTrade) {
            const INDEX_OF_LETTER_TO_TRADE = this.calculateProbability(this.letters.players[1].numberLetterInHand);
            if (!this.letters.players[1].selectedLettersForExchange.has(INDEX_OF_LETTER_TO_TRADE)) {
                this.letters.players[1].selectedLettersForExchange.add(INDEX_OF_LETTER_TO_TRADE);
                i++;
            }
        }
        this.letters.players[1].exchangeLetters();
        this.timeManager.endTurn();
        this.sourceMessageTextBox.next(['!échanger ', numberOfLettersToTrade.toString()]);
        this.lastCommandEntered = '!échanger ' + numberOfLettersToTrade.toString();
    }
}
