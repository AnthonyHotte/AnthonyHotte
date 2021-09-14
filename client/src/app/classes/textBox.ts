export class TextBox {
    word: string = '';
    inputs: string[] = [];
    character = false;

    constructor() {}
    send() {
        this.inputVerification();

        if (this.character === false) {
            this.inputs.push(this.word);
        }
    }
    inputVerification() {
        if (this.word.length > 5) {
            this.character = true;
        } else {
            this.character = false;
        }
    }
}
