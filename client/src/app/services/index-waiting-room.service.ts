import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class IndexWaitingRoomService {
    private index: number;
    constructor() {
        // default value
        this.index = 0;
    }
    // need to have a function so that we can spy on it
    getIndex() {
        return this.index;
    }
    setIndex(index: number) {
        this.index = index;
    }
}
