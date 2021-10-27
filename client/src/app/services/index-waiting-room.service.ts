import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class IndexWaitingRoomService {
    index: number;
    constructor() {
        // default value
        this.index = 0;
    }
}
