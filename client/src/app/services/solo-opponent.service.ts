import { Injectable } from '@angular/core';
import { MAXLETTERINHAND, PLACERCOMMANDLENGTH } from '@app/constants';
import { GameStatus } from '@app/game-status';
import { SoloOpponent2Service } from '@app/services/solo-opponent2.service';
import { FinishGameService } from './finish-game.service';
import { LetterService } from './letter.service';
import { PlaceLettersService } from './place-letters.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

@Injectable({
    providedIn: 'root',
})
export class SoloOpponentService {
    lastCommandEntered: string = 'Bonjour joueur!';
    constructor(
        public letters: LetterService,
        public timeManager: TimerTurnManagerService,
        public soloOpponent2: SoloOpponent2Service,
        public finishGameService: FinishGameService,
        public placeLettersService: PlaceLettersService,
    ) {
        this.letters.players[1].addLetters(MAXLETTERINHAND);
    }
    play() {
        if (this.timeManager.gameStatus === GameStatus.SoloPlayer) {
            if (this.timeManager.turn === 1) {
                const HUNDRED = 100;
                const TWENTY = 20;
                const TEN = 10;
                const SIX = 6;
                const PROBABILITY_OF_ACTION = this.calculateProbability(HUNDRED);
                if (PROBABILITY_OF_ACTION > TWENTY) {
                    this.lastCommandEntered = this.soloOpponent2.play();
                    this.endTurn('place');
                } else if (PROBABILITY_OF_ACTION <= TEN) {
                    this.skipTurn();
                } else {
                    const NUMBER_OF_LETTERS_TO_TRADE = this.calculateProbability(this.letters.players[1].allLettersInHand.length) - 1;
                    if (NUMBER_OF_LETTERS_TO_TRADE <= SIX) {
                        this.exchangeLetters(NUMBER_OF_LETTERS_TO_TRADE + 1);
                        this.endTurn('exchange');
                    } else {
                        this.skipTurn();
                    }
                }
            }
        } else if (this.timeManager.gameStatus === GameStatus.CreaterPlayer) {
            const commandToPlay = 'placer h8v an'; // change for the command played by the joining player
            const lettersReplacer = 'aa'; // change for the letters that were randomly exchange when placing or replacing letters
            if (commandToPlay.substring(0, PLACERCOMMANDLENGTH) === '!debug') {
                // nothing here right ?
            } else if (this.timeManager.turn === 0) {
                if (commandToPlay.substring(0, PLACERCOMMANDLENGTH) === '!placer') {
                    this.placeLettersService.placeWord(commandToPlay, lettersReplacer);
                    this.endTurn('place');
                } else if (commandToPlay.substring(0, PLACERCOMMANDLENGTH) === '!passer') {
                    this.skipTurn();
                } else if (commandToPlay.substring(0, PLACERCOMMANDLENGTH + 2) === '!échanger') {
                    this.exchangeLetters(lettersReplacer.length + 1, lettersReplacer); // to change for a not random function also to check +1
                } else if (commandToPlay.substring(0, PLACERCOMMANDLENGTH + 1) === '!réserve') {
                    // not sure what this does maybe Aziz can help ?  as this section of the code is copied from textboxbehavior
                    //  this.activateReserve();
                }
            }
            /*
            this.socketService.sendJoinPlayerTurn(this.timeManager.turnsSkippedInARow);
        } else {
            // emit creater turn
            this.socketService.sendCreaterPlayerTurn(this.timeManager.turnsSkippedInARow);
            */
        }
    }
    calculateProbability(percentage: number) {
        return Math.floor(Math.random() * percentage);
    }

    reset(playerNumber: number) {
        this.letters.players[playerNumber].allLettersInHand = [];
        this.letters.players[playerNumber].addLetters(MAXLETTERINHAND);
    }

    skipTurn() {
        if (this.timeManager.turn === 1) {
            this.endTurn('skip');
            this.lastCommandEntered = '!passer';
        }
    }
    exchangeLetters(numberOfLettersToTrade: number, lettersReplaced?: string) {
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
        // eslint-disable-next-line eqeqeq
        if (lettersReplaced == undefined) {
            this.letters.players[this.timeManager.turn].exchangeLetters(lettersToExchange);
            this.lastCommandEntered = '!échanger ' + numberOfLettersToTrade.toString();
        } else {
            this.letters.players[this.timeManager.turn].exchangeLetters(lettersToExchange, lettersReplaced);
            this.lastCommandEntered = '!échanger ' + numberOfLettersToTrade.toString();
        }
    }

    endTurn(reason: string) {
        this.timeManager.endTurn(reason);
        if (this.letters.players[this.timeManager.turn].allLettersInHand.length === 0) {
            this.finishGameService.isGameFinished = true;
        }
    }
}
