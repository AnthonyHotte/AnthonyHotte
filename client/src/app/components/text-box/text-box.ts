import { Component } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { MessagePlayer } from '@app/message';
import { LetterService } from '@app/services/letter.service';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
@Component({
    selector: 'app-text-box',
    templateUrl: './text-box.html',
    styleUrls: ['./text-box.scss'],
})
export class TextBoxComponent {
    word: string;
    messagesSoloOpponent: string[];
    debugCommand: boolean;
    text: string;
    message: MessagePlayer;

    constructor(public input: TextBox, private letterService: LetterService, private socket: SocketService, private turn: TimerTurnManagerService) {
        this.word = '';
        this.debugCommand = false;
    }

    buttonDetect() {
        let myMessage: MessagePlayer = { message: '', sender: this.letterService.players[0].name, role: 'Joueur' };
        if (this.turn.gameStatus === 0) {
            myMessage = { message: this.word, sender: this.letterService.players[0].name, role: 'Joueur' };
        } else {
            myMessage = { message: this.word, sender: this.letterService.players[1].name, role: 'Joueur' };
        }
        if (myMessage.message.substr(0, 1) === '!') {
            this.input.send(myMessage);
            this.input.isCommand(myMessage.message);
            this.socket.configureSendMessageToServer(myMessage, true);
        } else {
            this.input.send(myMessage);
            this.socket.configureSendMessageToServer(myMessage, true);
        }
        if (this.input.getDebugCommand()) {
            this.messagesSoloOpponent = this.input.getMessagesSoloOpponent();
        }
        this.debugCommand = this.input.getDebugCommand();
        this.word = '';
    }
    getInputs() {
        return this.input.getArray();
    }

    getSoloOpponentInputs() {
        return this.input.inputsSoloOpponent;
    }
}
