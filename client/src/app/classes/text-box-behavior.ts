import { MAX_CHARACTERS } from '@app/constants';
export class TextBox {
    word: string = '';
    inputs: string[] = [];
    character = false;
    buttonMessageState: string = 'ButtonMessageActivated';
    buttonCommandState: string = 'ButtonCommandReleased';

    send(myWord: string) {
        this.inputVerification(myWord);

        if (this.character === false) {
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
}
