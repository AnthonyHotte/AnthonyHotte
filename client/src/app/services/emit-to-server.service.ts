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
            // index turn can be -1 if there is an error
            if (indexTurn) {
                // next player turn is creater player
                this.socketService.sendCreaterPlayerTurn();
            } else if (indexTurn === 1) {
                // next player turn is joiner
                this.socketService.sendJoinPlayerTurn();
            }
        });
    }
}
