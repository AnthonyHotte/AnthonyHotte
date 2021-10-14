import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class StartCounterService {
    gameStartingInfo: BehaviorSubject<boolean>;
    // startingInfoObservable: Observable<boolean>;
    constructor() {
        this.gameStartingInfo = new BehaviorSubject<boolean>(false);
        // this.startingInfoObservable = this.gameStartingInfo.asObservable();
    }
    startGame() {
        this.gameStartingInfo.next(true);
    }
}
