import { Injectable } from '@angular/core';
import { MAX_CHARACTERS } from '@app/constants';
import { PlaceLettersService } from '@app/services/place-letters.service';
// eslint-disable-next-line no-restricted-imports
import * as Constants from '../constants';
@Injectable({
    providedIn: 'root',
})
export class TextBox {
    word: string = '';
    inputs: string[] = [];
    character: boolean = false;
    buttonMessageState: string = 'ButtonMessageActivated';
    buttonCommandState: string = 'ButtonCommandReleased';
    debugCommand: boolean = false;
    // command: Commands = new Commands();
    returnMessage: string;
    // injector = Injector.create([{ provide: PlaceLettersService }]);
    constructor(private readonly placeLettersService: PlaceLettersService) {
        // this.word = '';
        // this.inputs = [];
        // this.character = false;
        // this.buttonMessageState = 'ButtonMessageActivated';
        // this.buttonCommandState = 'ButtonCommandReleased';
        // this.debugCommand = false;
        // this.command = new Commands();
    }
    send(myWord: string) {
        this.inputVerification(myWord);
        if (this.character === false) {
            this.isCommand(myWord);
            this.inputs.push(myWord);
        }
    }
    inputVerification(myWord: string) {
        if (myWord.length > MAX_CHARACTERS) {
            this.character = true;
        } else {
            this.character = false;
        }
    }

    getWord() {
        return this.word;
    }

    getArray() {
        return this.inputs;
    }

    getButtonMessageState() {
        return this.buttonMessageState;
    }

    getButtonCommandState() {
        return this.buttonCommandState;
    }

    activateCommandButton() {
        this.buttonCommandState = 'ButtonCommandActivated';
        this.buttonMessageState = 'ButtonMessageReleased';
    }
    activateMessageButton() {
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
    }

    isCommand(myWord: string) {
        // const test: PlaceLettersService;
        // switch (myWord) {
        // case '!debug':
        if (myWord.substring(0, Constants.PLACERCOMMANDLENGTH) === '!debug') {
            this.debugCommand = true;
        } else if (myWord.substring(0, Constants.PLACERCOMMANDLENGTH) === '!placer') {
            this.returnMessage = this.placeLettersService.placeWord(myWord.substring(Constants.PLACERCOMMANDLENGTH + 1, myWord.length));
        }
    }

    getDebugCommand() {
        return this.debugCommand;
    }
}
