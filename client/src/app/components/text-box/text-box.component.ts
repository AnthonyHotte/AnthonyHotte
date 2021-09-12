import { Component, HostListener, OnInit } from '@angular/core';

@Component({
    selector: 'app-text-box',
    templateUrl: './text-box.component.html',
    styleUrls: ['./text-box.component.scss'],
})
export class TextBoxComponent implements OnInit {
    buttonPressed = '';
    buttonCode: number;
    word = '';
    array: string[] = [];

    constructor() {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
        this.buttonCode = event.keyCode;
        this.wordBuild();
    }

    wordBuild() {
        if (this.buttonCode !== 13) {
            this.word += this.buttonPressed;
        } else {
            this.addWord(this.word);
        }
    }

    wordVerification(myWord: string) {}

    addWord(myWord: string) {
        this.array.push(myWord);
    }
    ngOnInit(): void {}
}
