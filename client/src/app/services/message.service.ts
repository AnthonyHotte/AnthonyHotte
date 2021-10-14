import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class MessageService {
    gameStartingInfo: BehaviorSubject<boolean>;
    constructor(private link: Router) {
        this.gameStartingInfo = new BehaviorSubject<boolean>(false);
    }
    startGame() {
        this.link.navigate(['/game']);
        this.gameStartingInfo.next(true);
    }
}
