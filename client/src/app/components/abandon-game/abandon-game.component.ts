import { Component, HostListener } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { FinishGameService } from '@app/services/finish-game.service';

@Component({
    selector: 'app-abandon-game',
    templateUrl: './abandon-game.component.html',
    styleUrls: ['./abandon-game.component.scss'],
})
export class AbandonGameComponent {
    validationNecessary = false;

    constructor(private textBox: TextBox, private finishGameService: FinishGameService) {}

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler() {
        this.textBox.isCommand('!abandonner');
        this.finishGameService.isGameFinished = true;
        this.finishGameService.goToHomeAndRefresh();
    }

    finishCurrentGame() {
        this.finishGameService.isGameResigned = true;
        this.finishGameService.isGameFinished = true;
        this.textBox.isCommand('!abandonner');
    }

    getIsGameFinished() {
        return this.finishGameService.isGameFinished;
    }
}
