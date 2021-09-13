import { Component, HostListener, OnInit } from '@angular/core';
import { TextBox } from '../../classes/textBox';

@Component({
    selector: 'app-text-box-refactored',
    templateUrl: './text-box-refactored.component.html',
    styleUrls: ['./text-box-refactored.component.scss'],
})
export class TextBoxRefactoredComponent implements OnInit {
    constructor() {}

    input = new TextBox('');
    ngOnInit(): void {}

    // sendInformation(event: MouseEvent) {
    //     this.input.send();
    // }
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.keyCode === 13) {
            this.input.send();
        }
    }
}
