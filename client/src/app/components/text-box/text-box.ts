import { Component } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { MessagePlayer } from '@app/message';
@Component({
    selector: 'app-text-box',
    templateUrl: './text-box.html',
    styleUrls: ['./text-box.scss'],
})
export class TextBoxComponent {
    word: string;
    messagesSoloOpponent: string[];
    buttonCommandState: string;
    buttonMessageState: string;
    debugCommand: boolean;
    text: string;
    message: MessagePlayer;

    constructor(public input: TextBox) {
        this.word = '';
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
        this.debugCommand = false;
        this.message = { message: '', sender: 'Joueur' };
    }

    buttonDetect() {
        const myMessage: MessagePlayer = { message: '', sender: 'Joueur' };
        myMessage.message = this.word;
        if (this.buttonCommandState === 'ButtonCommandActivated') {
            this.input.send(myMessage);
            this.input.isCommand(myMessage.message);
        } else {
            this.input.send(myMessage);
        }
        if (this.input.getDebugCommand()) {
            this.messagesSoloOpponent = this.input.getMessagesSoloOpponent();
        }
        this.debugCommand = this.input.getDebugCommand();
        this.word = '';
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
    getInputs() {
        return this.input.getArray();
    }

    getSoloOpponentInputs() {
        return this.input.inputsSoloOpponent;
    }
}
