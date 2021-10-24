import { Injectable } from '@angular/core';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class EmitToServer {
    constructor(private socketService: SocketService) {}
    sendJoinPlayerTurn() {
        this.socketService.sendJoinPlayerTurn();
    }
    sendCreaterPlayerTurn() {
        this.socketService.sendCreaterPlayerTurn();
    }
}
