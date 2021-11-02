import { Component } from '@angular/core';
import { FinishGameService } from '@app/services/finish-game.service';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-abandon-game',
    templateUrl: './abandon-game.component.html',
    styleUrls: ['./abandon-game.component.scss'],
})
export class AbandonGameComponent {
    validationNecessary = false;
    constructor(
        private finishGameService: FinishGameService,
        private socketService: SocketService,
        private timerTurnManager: TimerTurnManagerService,
    ) {}

    finishCurrentGame() {
        this.finishGameService.isGameFinished = true;
        if (this.timerTurnManager.gameStatus !== 2) {
            let index = 0;
            if (this.timerTurnManager.gameStatus === 0) {
                index = 1;
            }
            this.socketService.finishedGameMessageTransmission(index);
        }
    }

    setIsGameUnderway() {
        if (this.socketService.gameIsFinished) {
            this.finishGameService.isGameFinished = this.socketService.gameIsFinished;
        }
        this.socketService.gameIsFinished = false;
        if (this.finishGameService.isGameFinished) {
            return 'Finie';
        }
        return 'En cours';
    }
}
