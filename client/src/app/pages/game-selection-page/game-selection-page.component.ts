import { Component } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent {
    constructor(private socket: SocketService, private timeTurnManager: TimerTurnManagerService, private letterService: LetterService) {}

    setSoloType() {
        this.timeTurnManager.gameStatus = 2;
    }
    setCreateMultiPlayerGame() {
        this.timeTurnManager.gameStatus = 0;
        this.letterService.reset();
    }
    setJoinMultiPayerGame() {
        this.timeTurnManager.gameStatus = 1;
        this.socket.sendGameListNeededNotification();
    }
}
