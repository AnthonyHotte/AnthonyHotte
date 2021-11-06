import { Injectable } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';
// import { TimerTurnManagerService } from './timer-turn-manager.service';

@Injectable({
    providedIn: 'root',
})
export class FinishGameService {
    finalScore: number[] = [];
    isGameFinished: boolean = false;
    constructor(
        private letterService: LetterService,
        private link: Router,
        private socketService: SocketService, // private timerTurnManager: TimerTurnManagerService,
    ) {}

    scoreCalculator() {
        for (const player of this.letterService.players) {
            let tempScore = player.score;
            for (const letter of player.allLettersInHand) {
                if (!(tempScore - letter.point < 0)) {
                    tempScore -= letter.point;
                } else {
                    tempScore = 0;
                }
            }
            this.finalScore.push(tempScore);
        }
        let indexOfPlayerWithEmptyHand: number;
        for (let i = 0; i < this.letterService.players.length; i++) {
            if (this.letterService.players[i].allLettersInHand.length === 0) {
                indexOfPlayerWithEmptyHand = i;
                for (let j = 0; j < this.letterService.players.length; j++) {
                    if (j !== indexOfPlayerWithEmptyHand) {
                        for (const letter of this.letterService.players[j].allLettersInHand) {
                            this.finalScore[indexOfPlayerWithEmptyHand] += letter.point;
                        }
                    }
                }
            }
        }
    }

    getWinner(): number[] {
        const winner: number[] = [];
        if (this.socketService.triggeredQuit) {
            winner.push(1);
        } else {
            if (this.finalScore[0] > this.finalScore[1]) {
                winner.push(0);
            } else if (this.finalScore[0] < this.finalScore[1]) {
                winner.push(1);
            } else {
                winner.push(0);
                winner.push(1);
            }
        }
        return winner;
    }

    getCongratulation(): string {
        this.scoreCalculator();
        const winners = this.getWinner();
        let congratulationMsg = 'Félicitation, ' + this.letterService.players[winners[0]].name;
        for (let i = 1; i < winners.length; i++) {
            congratulationMsg += ' et ' + this.letterService.players[winners[i]].name + ',';
        }
        congratulationMsg += ' vous avez gagné!!!';
        this.finalScore = [];

        return congratulationMsg;
    }
    getMessageTextBox(): string {
        let messageTextBox = 'Fin de partie - lettres restantes\n';
        for (const player of this.letterService.players) {
            messageTextBox += player.name;
            messageTextBox += ' :';
            for (const letter of player.allLettersInHand) {
                messageTextBox += ' ' + letter.letter;
            }
            messageTextBox += '\n';
        }

        return messageTextBox;
    }
    goToHomeAndRefresh() {
        this.socketService.handleDisconnect();
        this.link.navigate(['']);
    }
}
