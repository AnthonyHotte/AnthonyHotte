import { Component } from '@angular/core';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent {
    constructor(private timeTurnManager: TimerTurnManagerService, private socketService: SocketService) {}
    setSoloType() {
        this.timeTurnManager.gameStatus = 2;
    }

    cancelGame() {
        this.socketService.cancelGame();
    }
}
