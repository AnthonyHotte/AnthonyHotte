import { Injectable } from '@angular/core';
import { MAX_CHARACTERS, PLACERCOMMANDLENGTH } from '@app/constants';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { BehaviorSubject, Observable } from 'rxjs';

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
    returnMessage: string;
    currentMessage: Observable<string>;

    commandSuccessful: boolean = true;
    sourceMessage = new BehaviorSubject('command is successful');
    constructor(private readonly placeLettersService: PlaceLettersService) {
        this.word = '';
        this.inputs = [];
        this.character = false;
        this.buttonMessageState = 'ButtonMessageActivated';
        this.buttonCommandState = 'ButtonCommandReleased';
        this.debugCommand = false;
        this.currentMessage = this.sourceMessage.asObservable();
        this.sendExecutedCommand();
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
        if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!debug') {
            this.debugCommand = true;
        } else if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!placer') {
            this.returnMessage = this.placeLettersService.placeWord(myWord.substring(PLACERCOMMANDLENGTH + 1, myWord.length));
        }
    }
    getDebugCommand() {
        return this.debugCommand;
    }
    sendExecutedCommand() {
        this.sourceMessage.next(this.commandSuccessful.toString());
    }
}
