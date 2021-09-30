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
    }

    buttonDetect() {
        this.input.send(this.word);
        if (this.buttonCommandState === 'ButtonCommandActivated') {
            this.input.isCommand(this.word);
        }
        this.word = this.input.getWord();
        this.array = this.input.getArray();

        this.activateDebugCommand();
        this.scrollDown();
    }

    activateDebugCommand() {
        this.debugCommand = this.input.getDebugCommand();
        if (this.debugCommand) {
            this.input.activateDebugCommand();
        }
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
}
