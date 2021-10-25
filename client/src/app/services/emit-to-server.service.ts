import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SocketService } from './socket.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

@Injectable({
    providedIn: 'root',
})
export class EmitToServer {
    turnManager: Observable<number>;
    constructor(private socketService: SocketService, private timeTurnManager: TimerTurnManagerService) {
        this.timeTurnManager.indexTurn.subscribe((indexTurn) => {
            // next player turn is creater player
            if (indexTurn) {
                this.socketService.sendCreaterPlayerTurn();
            } else {
                // next player turn is joiner
                this.socketService.sendJoinPlayerTurn();
            }
        });
    }
}
