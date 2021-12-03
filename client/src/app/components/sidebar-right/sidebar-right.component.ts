import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { MessagePlayer } from '@app/message';
import { BestScoreService } from '@app/services/best-score.service';
import { FinishGameService } from '@app/services/finish-game.service';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterClickService } from '@app/services/place-letter-click.service';
import { SocketService } from '@app/services/socket.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { CountdownComponent } from '@ciri/ngx-countdown';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements AfterViewInit {
    @ViewChild('counter') counter: CountdownComponent;
    opponentSet: boolean = false;
    easyDifficultyIsTrue: boolean;
    time: number;
    turn: number;
    changedTurns: boolean = false;
    constructor(
        public turnTimeController: TimerTurnManagerService,
        private soloOpponent: SoloOpponentService,
        private letterService: LetterService,
        private textBox: TextBox,
        private letterBankService: LetterBankService,
        private placeLetterClick: PlaceLetterClickService,
        private gameFinishService: FinishGameService,
        private bestScoreService: BestScoreService,
        private socketService: SocketService,
    ) {
        this.setAttribute();
    }

    ngAfterViewInit() {
        if (this.turnTimeController.turn === 1 && this.turnTimeController.gameStatus === 2) {
            this.opponentSet = true;
            this.soloOpponentPlays();
        }
        this.textBox.isCommand('!aide');
        const myMessage: MessagePlayer = { message: 'Entrez !aide pour montrer ce message de nouveau.', sender: 'Systeme', role: 'Systeme' };
        this.textBox.inputs.push(myMessage);
    }
    showPassButton() {
        return this.turnTimeController.turn === 0 && !this.verifyLettersPlaced();
    }

    setAttribute() {
        this.time = this.turnTimeController.timePerTurn;
        this.turn = this.turnTimeController.turn;
        if (this.turnTimeController.gameStatus === 2) {
            this.letterService.reset();
            this.letterService.players[0].reset();
            this.soloOpponent.reset(1);
        }
    }
    difficultyInCharacters() {
        if (this.easyDifficultyIsTrue === true) {
            return 'Débutant';
        } else {
            return 'Expert';
        }
    }

    skipTurn() {
        const messageSkip = { message: '!passer', sender: this.letterService.players[0].name, role: 'Joueur' };
        this.textBox.inputs.push(messageSkip);
        this.textBox.isCommand('!passer');
        this.placeLetterClick.reset();
    }

    getNumberRemainingLetters() {
        return this.letterBankService.letterBank.length;
    }

    getNumberOfLettersForPlayer(indexPlayer: number) {
        return this.letterService.players[indexPlayer].allLettersInHand.length;
    }

    getScorePlayer(index: number) {
        return this.letterService.players[index].score;
    }
    getPlayerName(player: number) {
        return this.letterService.players[player].name;
    }

    getPlayerNameAndVerifyTurn() {
        if (this.turn !== this.turnTimeController.turn) {
            this.changedTurns = true;
            if (this.textBox.commandSuccessful) {
                this.opponentSet = true;
                this.textBox.commandSuccessful = false;
                this.soloOpponentPlays();
            }
            this.turn = this.turnTimeController.turn;
        }
        return this.getPlayerName(this.turn);
    }

    verifyChangedTurns(counter: CountdownComponent) {
        if (this.gameFinishService.isGameFinished) {
            counter.pause();
            this.textBox.handleEnter(this.gameFinishService.getMessageTextBox());
            const mode = this.socketService.is2990 ? 1 : 0;
            this.bestScoreService.updateBestScore();
            if (this.bestScoreService.verifyIfBestScore(this.letterService.players[0].score, mode)) {
                this.bestScoreService.addBestScore(this.letterService.players[0].name, this.letterService.players[0].score, mode);
            }
        } else {
            if (this.changedTurns === true) {
                counter.reset();
            }
            this.changedTurns = false;
        }
    }

    async soloOpponentPlays() {
        // this.wait3SecondsBeginningOfTurn();
        if (this.turnTimeController.gameStatus === 2) {
            const fourseconds = 4000;
            await this.delay(fourseconds);
            await this.soloOpponent.play();
            const message: MessagePlayer = {
                message: this.soloOpponent.lastCommandEntered,
                sender: this.letterService.players[1].name,
                role: 'Adversaire',
            };
            const messageSystem: MessagePlayer = {
                message: this.soloOpponent.lastMessageSystem,
                sender: 'Systeme',
                role: 'Systeme',
            };
            this.textBox.inputs.push(message);
            if (messageSystem.message !== '') {
                this.textBox.inputs.push(messageSystem);
            }
            if (this.textBox.debugCommand && this.soloOpponent.lastCommandEntered.substring(0, '!placer'.length) === '!placer') {
                this.textBox.handleEnter(this.soloOpponent.soloOpponent2.alternativePlay());
            }
        }
    }
    async delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    getLettersSelected() {
        return this.letterService.areLetterSelectedExchange;
    }
    verifyLettersPlaced(): boolean {
        if (this.placeLetterClick.isTileSelected && this.placeLetterClick.lettersFromHand.length > 0 && this.turnTimeController.turn === 0) {
            return true;
        }
        return false;
    }

    isGameFinished() {
        return this.gameFinishService.isGameFinished;
    }
}
