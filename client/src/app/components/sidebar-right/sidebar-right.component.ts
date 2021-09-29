import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { TextBox } from '@app/classes/text-box-behavior';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { CountdownComponent } from '@ciri/ngx-countdown';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements OnInit, AfterViewInit {
    messagePlayer: string;
    opponentMessage: string;
    messageLetterService: string;
    messageTimeManager: string;
    messageTextBox: string;
    subscriptionPlayer: Subscription;
    subscriptionOpponent: Subscription;
    subscriptionLetterService: Subscription;
    subscriptionTimeManager: Subscription;
    subscriptionTextBox: Subscription;
    message: string[] = [];
    playerName: string[] = ['', ''];
    opponentSet: boolean = false;

    numberOfSkippedTurns: number = 0;

    easyDifficultyIsTrue: boolean;
    time: number;
    turn: number;

    changedTurns: boolean = false;
    isRefreshed: boolean = false;

    constructor(
        private soloGameInformation: SoloGameInformationService,
        private turnTimeController: TimerTurnManagerService,
        private soloPlayer: SoloPlayerService,
        private soloOpponent: SoloOpponentService,
        private letterService: LetterService,
        private link: Router,
        private textBox: TextBox,
        private readonly gridService: GridService,
        private readonly placeLetterService: PlaceLettersService,
    ) {
        this.message = this.soloGameInformation.message;
        this.setAttribute();
    }

    ngAfterViewInit() {
        if (this.turn === 1) {
            this.soloOpponent.firstWordToPlay = true;
            this.opponentSet = true;
            this.soloOpponentPlays();
        }
    }

    ngOnInit() {
        this.subscriptionPlayer = this.soloPlayer.currentMessage.subscribe((messagePlayer) => (this.messagePlayer = messagePlayer));
        this.subscriptionOpponent = this.soloOpponent.currentMessage.subscribe((opponentMessage) => (this.opponentMessage = opponentMessage));
        this.subscriptionLetterService = PlayerLetterHand.currentMessage.subscribe(
            (messageLetterService) => (this.messageLetterService = messageLetterService),
        );
        this.subscriptionTimeManager = this.turnTimeController.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
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
        this.soloPlayer.reset();
        this.soloOpponent.reset();
    }
    difficultyInCharacters() {
        if (this.easyDifficultyIsTrue === true) {
            return 'Débutant';
        } else {
            return 'Expert';
        }
    }

    endTurn() {
        this.turnTimeController.endTurn();
        this.turn = parseInt(this.messageTimeManager, 10);
        if (this.turn === 0) {
            this.soloPlayer.changeTurn(this.turn.toString());
        } else {
            this.soloOpponent.changeTurn(this.turn.toString());
        }
        this.changedTurns = true;
        if (this.soloOpponent.valueToEndGame === this.soloOpponent.maximumAllowedSkippedTurns) {
            this.finishCurrentGame();
        }
    }

    skipTurn() {
        this.soloPlayer.incrementPassedTurns(this.soloOpponent.valueToEndGame, this.soloOpponent.lastTurnWasASkip);
        if (this.soloPlayer.valueToEndGame < this.soloPlayer.maximumAllowedSkippedTurns) {
            this.turnTimeController.endTurn();
            this.turn = parseInt(this.messageTimeManager, 10);
            this.soloPlayer.changeTurn(this.turn.toString());
            this.numberOfSkippedTurns = this.soloPlayer.valueToEndGame;
            this.changedTurns = true;
            this.opponentSet = true;
        } else {
            this.finishCurrentGame();
        }
    }

    getNumberRemainingLetters() {
        PlayerLetterHand.sendLettersInSackNumber();
        return this.messageLetterService;
    }

    getNumberOfLettersForPlayer() {
        return this.letterService.players[0].allLettersInHand.length;
    }

    getNumberOfLettersForOpponent() {
        return this.letterService.players[1].allLettersInHand.length;
    }

    getScorePlayer(index: number) {
        return this.letterService.players[index].score;
    }

    finishCurrentGame() {
        this.link.navigate(['']);
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
            if (this.turn === 0) {
                this.opponentSet = true;
            }
            this.turn = this.turnTimeController.turn;
        }
        return this.playerName[this.turn];
    }

    verifyChangedTurns(counter: CountdownComponent) {
        this.changedTurns ||= this.textBox.commandSuccessful;
        this.textBox.commandSuccessful = false;
        if (this.changedTurns === true) {
            this.time = parseInt(this.message[3], 10);
            counter.reset();
            if (this.turn === 1) {
                this.soloOpponentPlays();
            }
        }
        this.changedTurns = false;
    }

    soloOpponentPlays() {
        if (this.turnTimeController.turn === 1 && this.opponentSet) {
            const TIME_TO_LOAD = 3200;
            setTimeout(() => {
                this.opponentSet = false;
                const INTERVAL_TIME = 17000;
                const INTERVAL = window.setInterval(() => {
                    this.soloOpponent.skipTurn();
                    setTimeout(() => {
                        clearInterval(INTERVAL);
                    }, 1);
                }, INTERVAL_TIME);
                this.soloOpponent.play();
                this.changedTurns = true;
            }, TIME_TO_LOAD);
        }
    }
}
