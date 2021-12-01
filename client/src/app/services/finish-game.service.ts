import { Injectable } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { Router } from '@angular/router';
import { SocketService } from './socket.service';
import { RefreshServiceService } from './refresh-service.service';
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
        private refreshService: RefreshServiceService,
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
        if (this.finalScore[0] > this.finalScore[1]) {
            winner.push(0);
        } else if (this.finalScore[0] < this.finalScore[1]) {
            winner.push(1);
        } else {
            winner.push(0);
            winner.push(1);
        }

        return winner;
    }

    getCongratulation(): string {
        this.scoreCalculator();
        const winners = this.getWinner();
        let congratulationMsg: string;
        const finalScoreString = 'Le score final est ' + this.finalScore[0] + '-' + this.finalScore[1] + '.';
        if (winners.length === 2) {
            congratulationMsg =
                'Félicitation, ' +
                this.letterService.players[winners[0]].name +
                ' et ' +
                this.letterService.players[winners[1]].name +
                '! Vous avez fini à égalité. ' +
                finalScoreString;
        } else if (winners[0] === 0) {
            congratulationMsg = 'Félicitation, ' + this.letterService.players[winners[0]].name + '! Vous avez gagné! ' + finalScoreString;
        } else {
            congratulationMsg = 'Dommage! Vous avez perdu. ' + finalScoreString;
        }

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
        this.refreshService.needRefresh = true;
    }
}
