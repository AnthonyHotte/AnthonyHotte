import { Component, HostListener } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { ENTER_ASCII } from '@app/constants';

@Component({
    selector: 'app-text-box',
    templateUrl: './text-box.html',
    styleUrls: ['./text-box.scss'],
})
export class TextBoxComponent {
    word: string;
    array: string[];
    buttonCommandState: string;
    buttonMessageState: string;
    input: TextBox;
    debugCommand: boolean;

    constructor() {
        this.word = '';
        this.array = [];
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
        this.input = new TextBox();
        this.debugCommand = false;
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.key.charCodeAt(0) === ENTER_ASCII) {
            this.input.send(this.word);
            this.word = this.input.getWord();
            this.array = this.input.getArray();
            this.buttonCommandState = this.input.getButtonCommandState();
            this.buttonMessageState = this.input.getButtonMessageState();
        }
    }

    activateCommand() {
        this.input.activateCommandButton();
    }

    activateMessage() {
        this.input.activateMessageButton();
    }
}
