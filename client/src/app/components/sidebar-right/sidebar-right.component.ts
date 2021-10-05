import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { TextBox } from '@app/classes/text-box-behavior';
import { MessagePlayer } from '@app/message';
import { FinishGameService } from '@app/services/finish-game.service';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { CountdownComponent } from '@ciri/ngx-countdown';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements OnInit, AfterViewInit {
    messageTextBox: string;
    subscriptionTextBox: Subscription;
    message: string[] = [];
    playerName: string[] = ['', ''];
    opponentSet: boolean = false;
    easyDifficultyIsTrue: boolean;
    time: number;
    turn: number;

    changedTurns: boolean = false;

    constructor(
        private soloGameInformation: SoloGameInformationService,
        private turnTimeController: TimerTurnManagerService,
        private soloOpponent: SoloOpponentService,
        private letterService: LetterService,
        private textBox: TextBox,
        private readonly gridService: GridService,
        private readonly placeLetterService: PlaceLettersService,
        private finishGameService: FinishGameService,
    ) {
        this.message = this.soloGameInformation.message;
        this.setAttribute();
    }

    ngAfterViewInit() {
        if (this.turnTimeController.turn === 1) {
            this.opponentSet = true;
            this.soloOpponentPlays();
        }
    }

    ngOnInit() {
        this.subscriptionTextBox = this.textBox.currentMessage.subscribe((messageTextBox) => (this.messageTextBox = messageTextBox));
    }

    setAttribute() {
        if (this.message.length !== 0) {
            this.playerName[0] = this.message[0];
            this.playerName[1] = this.message[1];
            this.easyDifficultyIsTrue = this.message[2] === 'true';
            this.time = parseInt(this.message[3], 10);
            this.turn = this.turnTimeController.turn;
        } else {
            // if page is refreshed
            this.finishCurrentGame();
        }
        this.turnTimeController.initiateGame();
        this.turn = this.turnTimeController.turn;
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
        return PlayerLetterHand.allLetters.length;
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

    getPlayerName() {
        if (this.turn !== this.turnTimeController.turn) {
            this.changedTurns = true;
            if (this.textBox.commandSuccessful) {
                this.opponentSet = true;
                this.textBox.commandSuccessful = false;
                this.soloOpponentPlays();
            }
            this.turn = this.turnTimeController.turn;
        }
        return this.playerName[this.turn];
    }

    verifyChangedTurns(counter: CountdownComponent) {
        if (this.changedTurns === true) {
            this.time = parseInt(this.message[3], 10);
            counter.reset();
        }
        this.changedTurns = false;
    }

    soloOpponentPlays() {
        this.soloOpponent.play();
        const message: MessagePlayer = { message: this.soloOpponent.lastCommandEntered, sender: 'Adversaire', debugState: false };
        this.textBox.inputs.push(message);
    }
}
