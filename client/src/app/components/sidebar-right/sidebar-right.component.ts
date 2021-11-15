import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { GameStatus } from '@app/game-status';
import { MessagePlayer } from '@app/message';
import { FinishGameService } from '@app/services/finish-game.service';
import { GridService } from '@app/services/grid.service';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterClickService } from '@app/services/place-letter-click.service';
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
        private readonly gridService: GridService,
        private readonly placeLetterService: PlaceLettersService,
        private letterBankService: LetterBankService,
        private placeLetterClick: PlaceLetterClickService,
        private gameFinishService: FinishGameService,
    ) {
        this.setAttribute();
    }

    ngAfterViewInit() {
        if (this.turnTimeController.turn === 1 && this.turnTimeController.gameStatus === 2) {
            this.opponentSet = true;
            this.soloOpponentPlays();
        }
    }
    showPassButton() {
        return this.turnTimeController.turn === 0;
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
        if (this.turnTimeController.turn === 1 && this.turnTimeController.gameStatus === GameStatus.SoloPlayer) {
            // this.soloOpponentPlays();
        }
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

    increaseFontSize() {
        this.gridService.increasePoliceSize();
        this.placeLetterService.policeSizeChanged();
    }
    decreaseFontSize() {
        this.gridService.decreasePoliceSize();
        this.placeLetterService.policeSizeChanged();
    }
    getPlayerName(player: number) {
        const VISUAL_LIMITS_OF_LENGTH = 8;
        if (this.letterService.players[player].name.length >= VISUAL_LIMITS_OF_LENGTH) {
            return (
                this.letterService.players[player].name.substring(0, VISUAL_LIMITS_OF_LENGTH) +
                ' ' +
                this.letterService.players[player].name.substring(VISUAL_LIMITS_OF_LENGTH, VISUAL_LIMITS_OF_LENGTH * 2) +
                ' ' +
                this.letterService.players[player].name.substring(VISUAL_LIMITS_OF_LENGTH * 2, this.letterService.players[player].name.length)
            );
        }
        return this.letterService.players[player].name;
    }

    getPlayerNameAndVerifyTurn() {
        if (this.turn !== this.turnTimeController.turn) {
            this.changedTurns = true;
            if (this.textBox.commandSuccessful && this.turnTimeController.gameStatus === 2) {
                this.opponentSet = true;
                this.textBox.commandSuccessful = false;
                this.soloOpponentPlays();
            }
            this.turn = this.turnTimeController.turn;
        }
        return this.letterService.players[this.turn].name;
    }

    verifyChangedTurns(counter: CountdownComponent) {
        if (this.gameFinishService.isGameFinished) {
            counter.pause();
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
            this.textBox.inputs.push(message);
            this.textBox.scrollDown();
        }
    }
    async delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    getLettersSelected() {
        return this.letterService.areLetterSelectedExchange;
    }
}
