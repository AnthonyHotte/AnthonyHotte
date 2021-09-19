import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GestionTimerTourService } from '@app/services/gestion-timer-tour.service';
import { LetterService } from '@app/services/letter.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements OnInit {
    messagePlayer: string;
    opponentMessage: string;
    messageLetterService: string;
    messageTimeManager: string;
    subscriptionPlayer: Subscription;
    subscriptionOpponent: Subscription;
    subscriptionLetterService: Subscription;
    subscriptionTimeManager: Subscription;
    message: string[] = [];
    playerName: string[] = ['', ''];

    numberOfSkippedTurns: number = 0;

    easyDifficultyIsTrue: boolean;
    time: number;
    turn: number;

    changedTurns: boolean = false;

    constructor(
        private soloGameInformation: SoloGameInformationService,
        private turnTimeController: GestionTimerTourService,
        private soloPlayer: SoloPlayerService,
        private soloOpponent: SoloOpponentService,
        private letterService: LetterService,
        private link: Router,
    ) {
        this.message = this.soloGameInformation.message;
        this.setAttribute();
    }

    ngOnInit() {
        this.subscriptionPlayer = this.soloPlayer.currentMessage.subscribe((messagePlayer) => (this.messagePlayer = messagePlayer));
        this.subscriptionOpponent = this.soloOpponent.currentMessage.subscribe((opponentMessage) => (this.opponentMessage = opponentMessage));
        this.subscriptionLetterService = this.letterService.currentMessage.subscribe(
            (messageLetterService) => (this.messageLetterService = messageLetterService),
        );
        this.subscriptionTimeManager = this.turnTimeController.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
    }

    setAttribute() {
        this.playerName[0] = this.message[0];
        this.playerName[1] = this.message[1];
        this.easyDifficultyIsTrue = this.message[2] === 'true';
        this.time = parseInt(this.message[3], 10);
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
    }

    skipTurn() {
        if (this.soloPlayer.valueToEndGame < 2) {
            this.turnTimeController.endTurn();
            this.turn = parseInt(this.messageTimeManager, 10);
            this.soloPlayer.changeTurn(this.turn.toString());
            this.soloPlayer.incrementPassedTurns();
            this.numberOfSkippedTurns = this.soloPlayer.valueToEndGame;
            this.changedTurns = true;
        } else {
            this.finishCurrentGame();
        }
    }

    getNumberRemainingLetters() {
        this.letterService.sendLettersInSackNumber();
        return this.messageLetterService;
    }

    getNumberOfLettersForPlayer() {
        return this.letterService.lettersForPlayer.length;
    }

    getNumberOfLettersForOpponent() {
        return this.letterService.lettersForOpponent.length;
    }

    getScorePlayer() {
        return this.soloPlayer.getScore();
    }

    getScoreOpponent() {
        return this.soloOpponent.getScore();
    }

    finishCurrentGame() {
        this.link.navigate(['home']);
    }

    exchangeLetters() {
        this.soloPlayer.exchangeLetters();
        this.endTurn();
    }

    showLettersToBeExchanged() {
        let letters = 'Aucune lettre';
        if (this.letterService.selectedLettersForExchangePlayer.size !== 0) {
            letters = '';
        }
        for (const item of this.letterService.getLettersForExchange()) {
            letters += item + ' ';
        }
        return letters;
    }

    getPlayerName() {
        if (this.turn !== this.turnTimeController.turn) {
            this.changedTurns = true;
            this.turn = this.turnTimeController.turn;
        }
        return this.playerName[this.turn];
    }

    verifyChangedTurns() {
        if (this.changedTurns === true) {
            this.time = parseInt(this.message[3], 10);
        }
        this.changedTurns = false;
        return this.time;
    }
}
