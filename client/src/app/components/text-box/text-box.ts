import { Component, OnInit } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { MessagePlayer } from '@app/message';
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
    array: MessagePlayer[];
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
    message: MessagePlayer;

    constructor(private timeManager: TimerTurnManagerService, public input: TextBox) {
        this.word = '';
        this.array = [];
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
        this.debugCommand = false;

        this.messagesSoloOpponent = [];
        this.message = { message: '', sender: 'Joueur', debugSate: false };
    }

    buttonDetect() {
        const myMessage: MessagePlayer = { message: '', sender: 'Joueur', debugSate: false };
        myMessage.message = this.word;
        if (this.buttonCommandState === 'ButtonCommandActivated') {
            this.input.send(myMessage);
            this.input.isCommand(myMessage.message);
        } else {
            this.input.send(myMessage);
        }
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

    getInputs() {
        return this.input.getArray();
    }

    getSoloOpponentInputs() {
        return this.input.inputsSoloOpponent;
    }
}
