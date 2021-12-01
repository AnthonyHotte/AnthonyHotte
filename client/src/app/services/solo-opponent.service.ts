import { Injectable } from '@angular/core';
import { MAXLETTERINHAND } from '@app/constants';
import { GameStatus } from '@app/game-status';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { SoloOpponent2Service } from '@app/services/solo-opponent2.service';
import { FinishGameService } from './finish-game.service';
import { ObjectivesService } from './objectives.service';
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
        public objectiveService: ObjectivesService,
        private letterBankService: LetterBankService,
    ) {
        this.letters.players[1].addLetters(MAXLETTERINHAND);
    }
    async play(): Promise<void> {
        if (this.timeManager.gameStatus !== GameStatus.SoloPlayer) return;
        if (this.timeManager.turn !== 1) return;
        if (this.soloOpponent2.expertmode) {
            this.lastCommandEntered = await this.soloOpponent2.play();
            if (this.lastCommandEntered === '!placer undefined') {
                this.exchangeLettersExpert();
                this.endTurn('exchange'); // TODO DEBUG HERE, not working for some reasons
            } else {
                this.endTurn('place');
            }
        } else {
            const HUNDRED = 100;
            const TWENTY = 20;
            const TEN = 10;
            const SIX = 6;
            const PROBABILITY_OF_ACTION = this.calculateProbability(HUNDRED);
            if (PROBABILITY_OF_ACTION > TWENTY) {
                this.lastCommandEntered = await this.soloOpponent2.play();
                if (this.lastCommandEntered === '!placer undefined') {
                    this.skipTurn();
                } else {
                    this.endTurn('place');
                }
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
    }
    calculateProbability(percentage: number) {
        return Math.floor(Math.random() * percentage);
    }

    reset(playerNumber: number) {
        this.letters.players[playerNumber].allLettersInHand = [];
        this.letters.players[playerNumber].addLetters(MAXLETTERINHAND);
    }

    skipTurn() {
        if (this.timeManager.turn !== 1) return;
        this.endTurn('skip');
        this.lastCommandEntered = '!passer';
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
        this.lastCommandEntered = '!échanger ' + numberOfLettersToTrade.toString();
    }
    exchangeLettersExpert() {
        if (this.getNumberRemainingLetters() >= MAXLETTERINHAND) {
            this.exchangeLetters(MAXLETTERINHAND);
        } else {
            this.exchangeLetters(this.getNumberRemainingLetters());
        }
    }
    getNumberRemainingLetters() {
        return this.letterBankService.letterBank.length;
    }
    endTurn(reason: string) {
        if (reason === 'place') {
            this.objectiveService.consectivePlacementPlayers[this.timeManager.turn]++;
        } else {
            this.objectiveService.consectivePlacementPlayers[this.timeManager.turn] = 0;
        }
        this.timeManager.endTurn(reason);
        if (this.letters.players[this.timeManager.turn].allLettersInHand.length === 0) {
            this.finishGameService.isGameFinished = true;
        }
    }
}
