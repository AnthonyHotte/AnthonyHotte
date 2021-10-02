import { Injectable } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root',
})
export class FinishGameService {
    finalScore: number[] = [];
    isGameFinished: boolean = false;
    constructor(private letterService: LetterService, private link: Router) {}

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
        let currentTop = 0;
        let winner: number[] = [];
        for (let i = 0; i < this.finalScore.length; i++) {
            if (this.finalScore[i] > currentTop) {
                winner = [];
                winner.push(i);
                currentTop = this.finalScore[i];
            } else if (this.finalScore[i] === currentTop) {
                winner.push(i);
            }
        }
        return winner;
    }

    getCongratulation(): string {
        this.scoreCalculator();
        const winners = this.getWinner();
        let congratulationMsg = 'Félicitation, ' + winners[0];
        for (let i = 1; i < winners.length; i++) {
            congratulationMsg += ' et ' + winners[i] + ',';
        }
        congratulationMsg += ' vous Avez gagné!!!';
        this.finalScore = [];

        return congratulationMsg;
    }
    getMessageTextBox(): string {
        let messageTextBox = 'Fin de partie - lettres restantes \n';
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
        this.link.navigate(['']);
    }
}
