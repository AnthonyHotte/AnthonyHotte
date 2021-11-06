import { Component } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { FinishGameService } from '@app/services/finish-game.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-finished-game',
    templateUrl: './finished-game.component.html',
    styleUrls: ['./finished-game.component.scss'],
})
export class FinishedGameComponent {
    isGameFinished: boolean = true;
    congratulation: string;
    subscription: Subscription; // useful for updating views and current value : we observe the value of socketService

    constructor(public finishGameService: FinishGameService, private textBox: TextBox) {
        this.subscription = this.finishGameService.currentEndGameValue.subscribe((valueOfEndGame) => (this.isGameFinished = valueOfEndGame));
    }

    getMessageCongratulation(): string {
        return this.finishGameService.getCongratulation();
    }

    getGameStatus(): boolean {
        if (this.finishGameService.isGameFinished) {
            this.textBox.handleEnter(this.finishGameService.getMessageTextBox());
        }
        return this.finishGameService.isGameFinished;
    }

    quitGame() {
        this.finishGameService.goToHomeAndRefresh();
    }
}
