import { Component, HostListener, OnInit } from '@angular/core';
import { ENTER_ASCII } from '@app/constants';
import { TextBox } from '../../classes/textBox';

@Component({
    selector: 'app-text-box-refactored',
    templateUrl: './text-box-refactored.component.html',
    styleUrls: ['./text-box-refactored.component.scss'],
})
export class TextBoxRefactoredComponent implements OnInit {
    word = '';
    array: string[] = [];
    buttonCommandState: string = 'ButtonCommandReleased';
    buttonMessageState: string = 'ButtonMessageActivated';

    constructor() {}

    input = new TextBox();

    ngOnInit(): void {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.keyCode === ENTER_ASCII) {
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
