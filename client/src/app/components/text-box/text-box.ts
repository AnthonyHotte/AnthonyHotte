import { Component, OnInit } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
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
    word: string;
    array: string[];
    messagesSoloOpponent: string[];
    buttonCommandState: string;
    buttonMessageState: string;
    debugCommand: boolean;
    turn: number;
    text: string;
    valueToEndGame: number;
    debugMessage: string;

    playerName: string;
    oponentName: string;

    constructor(private timeManager: TimerTurnManagerService, public input: TextBox) {
        this.word = '';
        this.array = [];
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
        this.debugCommand = false;

        this.messagesSoloOpponent = [];
        // this.messageSoloInfo = this.soloGameInformation.message;
        // this.input = new TextBox(this.placeLetter, this.soloPlayer, this.soloOpponent, this.timeManager, this.link, this.letterService);
        // this.input.currentMessage.subscribe((messageTextBox) => (this.messageTextBox = messageTextBox));
    }

    buttonDetect() {
        this.input.send(this.word);
        if (this.buttonCommandState === 'ButtonCommandActivated') {
            this.input.isCommand(this.word);
        }
        this.word = this.input.getWord();
        this.array = this.input.getArray();
        this.scrollDown();
        if (this.input.getDebugCommand()) {
            this.messagesSoloOpponent = this.input.getMessagesSoloOpponent();
        }
        this.debugCommand = this.input.getDebugCommand();
    }

    ngOnInit() {
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

    scrollDown() {
        const mondiv = document.getElementById('DisplayZone');
        if (mondiv !== null) {
            mondiv.scrollTo(0, mondiv.scrollHeight);
        }
    }
    // getMessageSoloOpoonent() {
    //     if (parseInt(this.messageSoloOpponent[1], 10) > 0) {
    //         return 'commande: ' + this.messageSoloOpponent[0] + ' nombre de lettre(s) échangée(s): ' + this.messageSoloOpponent[1];
    //     } else {
    //         return 'commande: ' + this.messageSoloOpponent[0];
    //     }
    // }

    getInputs() {
        return this.input.getArray();
    }

    getSoloOpponentInputs() {
        return this.input.inputsSoloOpponent;
    }
}
