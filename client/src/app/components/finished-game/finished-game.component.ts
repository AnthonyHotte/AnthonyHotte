import { Component } from '@angular/core';
import { FinishGameService } from '@app/services/finish-game.service';

@Component({
    selector: 'app-finished-game',
    templateUrl: './finished-game.component.html',
    styleUrls: ['./finished-game.component.scss'],
})
export class FinishedGameComponent {
    isGameFinished: boolean = true;
    congratulation: string;

    constructor(public finishGameService: FinishGameService) {}

    getMessageCongratulation(): string {
        return this.finishGameService.getCongratulation();
    }

    getGameStatus(): boolean {
        return this.finishGameService.isGameFinished;
    }

    quitGame() {
        this.finishGameService.goToHomeAndRefresh();
    }
}
