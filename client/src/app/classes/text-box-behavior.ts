import { MAX_CHARACTERS } from '@app/constants';
import { Commands } from './commands';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TextBox {
    word: string;
    inputs: string[];
    character: boolean;
    buttonMessageState: string;
    buttonCommandState: string;
    debugCommand: boolean;
    command: Commands;
    commandSuccessful: boolean = false;
    currentMessage: Observable<string>;
    messageSource = new BehaviorSubject('message for executed command');

    constructor() {
        this.word = '';
        this.inputs = [];
        this.character = false;
        this.buttonMessageState = 'ButtonMessageActivated';
        this.buttonCommandState = 'ButtonCommandReleased';
        this.debugCommand = false;
        this.command = new Commands();
        this.currentMessage = this.messageSource.asObservable();
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
        switch (myWord) {
            case '!debug':
                this.inputs.push('Vous etes en mode debug');
                this.debugCommand = this.command.activateDebugCommand();
                break;
            // case //condition pour appeler la methode:
            // this.command.activatePlayerCommand();
        }
    }

    getDebugCommand() {
        return this.debugCommand;
    }

    sendExecutedCommand() {
        this.messageSource.next(this.commandSuccessful.toString());
        this.commandSuccessful = false;
    }
}
