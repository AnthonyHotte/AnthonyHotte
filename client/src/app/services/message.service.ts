import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    gameStartingInfo: BehaviorSubject<boolean>;
    startGameSubscription: Subscription;
    constructor(private link: Router, private socketService: SocketService) {
        this.gameStartingInfo = new BehaviorSubject<boolean>(false);
    }
    gameStartingInfoSubscribe() {
        this.startGameSubscription = this.socketService.startGame.subscribe((start) => {
            if (start) {
                this.link.navigate(['/game']);
                this.gameStartingInfo.next(true);
            }
        });
    }
}
