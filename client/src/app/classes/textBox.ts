export class TextBox {
    word: string = '';
    inputs: string[] = [];
    character = false;

    constructor(myInput: string) {
        this.word = myInput;
    }
    send() {
        this.inputVerification();

        if (this.character === false) {
            this.inputs.push(this.word);
        }
    }
    inputVerification() {
        if (this.word.length > 512) {
            this.character = true;
        } else {
            this.character = false;
        }
    }
}
