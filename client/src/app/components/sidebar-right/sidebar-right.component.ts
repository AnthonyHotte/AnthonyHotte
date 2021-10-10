import { AfterViewInit, Component } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { MessagePlayer } from '@app/message';
import { FinishGameService } from '@app/services/finish-game.service';
import { GridService } from '@app/services/grid.service';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { CountdownComponent } from '@ciri/ngx-countdown';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements AfterViewInit {
    messageTextBox: string;
    message: string[] = [];
    playerName: string[] = ['', ''];
    opponentSet: boolean = false;
    easyDifficultyIsTrue: boolean;
    time: number;
    turn: number;

    changedTurns: boolean = false;

    constructor(
        private turnTimeController: TimerTurnManagerService,
        private soloOpponent: SoloOpponentService,
        private letterService: LetterService,
        private textBox: TextBox,
        private readonly gridService: GridService,
        private readonly placeLetterService: PlaceLettersService,
        private finishGameService: FinishGameService,
        private letterBankService: LetterBankService,
    ) {
        this.setAttribute();
    }

    ngAfterViewInit() {
        if (this.turnTimeController.turn === 1) {
            this.opponentSet = true;
            this.soloOpponentPlays();
        }
    }

    setAttribute() {
        this.time = this.turnTimeController.timePerTurn;
        this.turn = this.turnTimeController.turn;
        this.turnTimeController.initiateGame();
        this.letterService.reset();
        this.letterService.players[0].reset();
        this.soloOpponent.reset(1);
    }
    difficultyInCharacters() {
        if (this.easyDifficultyIsTrue === true) {
            return 'Débutant';
        } else {
            return 'Expert';
        }
    }

    skipTurn() {
        this.textBox.isCommand('!passer');
        this.soloOpponentPlays();
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

    finishCurrentGame() {
        this.finishGameService.isGameFinished = true;
    }

    increaseFontSize() {
        this.gridService.increasePoliceSize();
        this.placeLetterService.policeSizeChanged();
    }
    decreaseFontSize() {
        this.gridService.decreasePoliceSize();
        this.placeLetterService.policeSizeChanged();
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
        return this.letterService.players[this.turn].name;
    }

    verifyChangedTurns(counter: CountdownComponent) {
        if (this.changedTurns === true) {
            counter.reset();
        }
        this.changedTurns = false;
    }

    soloOpponentPlays() {
        this.soloOpponent.play();
        let message: MessagePlayer;
        if (this.textBox.debugCommand) {
            message = { message: this.soloOpponent.lastCommandEntered, sender: 'Adversaire' };
        } else {
            message = { message: this.soloOpponent.lastCommandEntered, sender: 'Adversaire' };
        }
        this.textBox.inputs.push(message);
        this.textBox.scrollDown();
    }
}
