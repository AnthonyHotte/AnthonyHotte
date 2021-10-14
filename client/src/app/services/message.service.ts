import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    gameStartingInfo: BehaviorSubject<boolean>;
    constructor() {
        this.gameStartingInfo = new BehaviorSubject<boolean>(false);
    }
    startGame() {
        this.gameStartingInfo.next(true);
    }
}
