import { MAX_CHARACTERS } from '@app/constants';
export class TextBox {
    word: string = '';
    inputs: string[] = [];
    character = false;
    buttonMessageState: string = 'ButtonMessageActivated';
    buttonCommandState: string = 'ButtonCommandReleased';

    constructor() {}
    send() {
        this.inputVerification();

        if (this.character === false) {
            this.inputs.push(this.word);
        }
    }
    inputVerification() {
        if (this.word.length > MAX_CHARACTERS) {
            this.character = true;
        } else {
            this.character = false;
        }
    }
    activateCommandButton() {
        this.buttonCommandState = 'ButtonCommandActivated';
        this.buttonMessageState = 'ButtonMessageReleased';
    }
    activateMessageButton() {
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
    }
}
