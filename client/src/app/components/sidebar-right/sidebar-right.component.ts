import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { TextBox } from '@app/classes/text-box-behavior';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
// import { SoloOpponent2Service } from '@app/services/solo-opponent2.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { CountdownComponent } from '@ciri/ngx-countdown';
import { Subscription } from 'rxjs';
// import { FinishGameService } from '@app/services/finish-game.service';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements OnInit, AfterViewInit {
    /* @ViewChild('counter')
    counterTimer: CountdownComponent;
    gameFinish: Subscription;*/
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

    constructor(
        private soloGameInformation: SoloGameInformationService,
        private turnTimeController: TimerTurnManagerService,
        private soloPlayer: SoloPlayerService,
        private soloOpponent: SoloOpponentService,
        private letterService: LetterService,
        private textBox: TextBox,
        private readonly gridService: GridService,
        private readonly placeLetterService: PlaceLettersService, // private finishGameService: FinishGameService,
    ) {
        this.message = this.soloGameInformation.message;
        /* TODO this.gameFinish = this.finishGameService.observableForGameFinished.subscribe(() => {
            this.counterTimer.pause();
        }); */
        this.setAttribute();
    }

    ngAfterViewInit() {
        if (this.turnTimeController.turn === 1) {
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

    skipTurn() {
        this.textBox.send('!passer');
        this.textBox.isCommand('!passer');
        this.soloOpponentPlays();
    }

    getNumberRemainingLetters() {
        PlayerLetterHand.sendLettersInSackNumber();
        return this.messageLetterService;
    }

    getNumberOfLettersForPlayer(indexPlayer: number) {
        return this.letterService.players[indexPlayer].allLettersInHand.length;
    }

    getScorePlayer(index: number) {
        return this.letterService.players[index].score;
    }

    finishCurrentGame() {
        this.textBox.finishCurrentGame();
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
        // if (this.turnTimeController.turn === 1 && this.opponentSet) {
        //     this.opponentSet = false;
        // let skipNeeded = false;
        // const TIME_TO_LOAD = 3200;
        // setTimeout(() => {
        this.soloOpponent.play();
        // skipNeeded = true;
        // skipNeeded = false;
        // clearInterval(INTERVAL_SKIP);
        //   this.textBox.inputsSoloOpponent.push(this.soloOpponent.lastCommandEntered);
        //        this.changedTurns = true;
        // }, TIME_TO_LOAD);
        // }
    }
}
