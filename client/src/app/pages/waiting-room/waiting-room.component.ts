import { Component, HostListener } from '@angular/core';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent {
    constructor(private timeTurnManager: TimerTurnManagerService, private socketService: SocketService) {}

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler() {
        this.socketService.handleDisconnect();
    }

    setSoloType() {
        this.timeTurnManager.gameStatus = 2;
        this.cancelGame();
    }

    cancelGame() {
        this.socketService.cancelGame();
    }
}
