import { Component, HostListener } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';

@Component({
    selector: 'app-abandon-game',
    templateUrl: './abandon-game.component.html',
    styleUrls: ['./abandon-game.component.scss'],
})
export class AbandonGameComponent {
    validationNecessary = false;

    constructor(private textBox: TextBox) {}

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler() {
        this.textBox.isCommand('!abandonner');
    }

    finishCurrentGame() {
        this.textBox.isCommand('!abandonner');
    }
}
