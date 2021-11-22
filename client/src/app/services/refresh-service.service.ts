import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RefreshServiceService {
    needRefresh = false;

    refresh() {
        window.location.reload(); // refresh
        this.needRefresh = false;
    }
}
