import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TextBox } from '@app/classes/text-box-behavior';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { Subscription } from 'rxjs';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
@Component({
    selector: 'app-text-box',
    templateUrl: './text-box.html',
    styleUrls: ['./text-box.scss'],
})
export class TextBoxComponent implements OnInit {
    messagePlayer: string;
    messageLetterService: string;
    messageTimeManager: string;
    messageSoloOpponent: string[];
    messageSoloInfo: string[];
    subscriptionPlayer: Subscription;
    subscriptionLetterService: Subscription;
    subscriptionTimeManager: Subscription;
    subscriptionSoloOpponent: Subscription;
    subscriptionTextBox: Subscription;
    word: string;
    array: string[];
    buttonCommandState: string;
    buttonMessageState: string;
    input: TextBox;
    messageTextBox: string;

    debugCommand: boolean;
    turn: number;
    text: string;
    valueToEndGame: number;

    playerName: string;
    oponentName: string;

    constructor(
        private soloPlayer: SoloPlayerService,
        private letterService: LetterService,
        private timeManager: TimerTurnManagerService,
        private soloOpponent: SoloOpponentService,
        private soloGameInformation: SoloGameInformationService,
        private link: Router,
        private placeLetter: PlaceLettersService,
    ) {
        this.word = '';
        this.array = [];
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
        this.debugCommand = false;
        this.messageSoloInfo = this.soloGameInformation.message;
        this.input = new TextBox(this.placeLetter, this.soloPlayer, this.soloOpponent, this.timeManager, this.link, this.letterService);
        this.input.currentMessage.subscribe((messageTextBox) => (this.messageTextBox = messageTextBox));
    }

    buttonDetect() {
        this.input.send(this.word);
        if (this.buttonCommandState === 'ButtonCommandActivated') {
            this.input.isCommand(this.word);
        }
        this.word = this.input.getWord();
        this.array = this.input.getArray();
        this.debugCommand = this.input.getDebugCommand();
    }

    ngOnInit() {
        this.subscriptionPlayer = this.soloPlayer.currentMessage.subscribe((messagePlayer) => (this.messagePlayer = messagePlayer));
        this.subscriptionLetterService = PlayerLetterHand.currentMessage.subscribe(
            (messageLetterService) => (this.messageLetterService = messageLetterService),
        );
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.subscriptionSoloOpponent = this.soloOpponent.messageTextBox.subscribe(
            (messageSoloOpponent) => (this.messageSoloOpponent = messageSoloOpponent),
        );
        this.subscriptionTextBox = this.input.currentMessage.subscribe((messageTextBox) => (this.messageTextBox = messageTextBox));
        this.turn = this.timeManager.turn;
        this.valueToEndGame = 0;
    }

    activateCommand() {
        this.buttonCommandState = 'ButtonCommandActivated';
        this.buttonMessageState = 'ButtonMessageReleased';
        this.input.activateCommandButton();
    }

    activateMessage() {
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
        this.input.activateMessageButton();
    }

    getMessageSoloOpoonent() {
        if (parseInt(this.messageSoloOpponent[1], 10) > 0) {
            return 'commande: ' + this.messageSoloOpponent[0] + ' nombre de lettre(s) échangée(s): ' + this.messageSoloOpponent[1];
        } else {
            return 'commande: ' + this.messageSoloOpponent[0];
        }
    }
}
