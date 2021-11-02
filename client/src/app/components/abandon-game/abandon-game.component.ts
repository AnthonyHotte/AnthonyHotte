import { Component } from '@angular/core';
import { FinishGameService } from '@app/services/finish-game.service';
import { SocketService } from '@app/services/socket.service';

@Component({
    selector: 'app-abandon-game',
    templateUrl: './abandon-game.component.html',
    styleUrls: ['./abandon-game.component.scss'],
})
export class AbandonGameComponent {
    validationNecessary = false;
    constructor(private finishGameService: FinishGameService, private socketService: SocketService) {}

    finishCurrentGame() {
        this.finishGameService.isGameFinished = true;
        this.socketService.finishedGameMessageTransmission();
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
