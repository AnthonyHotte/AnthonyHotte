import { Component } from '@angular/core';
import { FinishGameService } from '@app/services/finish-game.service';

@Component({
    selector: 'app-abandon-game',
    templateUrl: './abandon-game.component.html',
    styleUrls: ['./abandon-game.component.scss'],
})
export class AbandonGameComponent {
    validationNecessary = false;
    constructor(private finishGameService: FinishGameService) {}

    finishCurrentGame() {
        this.finishGameService.isGameFinished = true;
    }
}
