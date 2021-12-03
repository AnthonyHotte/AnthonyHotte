import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class RefreshServiceService {
    needRefresh = false;

    refresh() {
        this.windowRefresh();
        this.needRefresh = false;
    }

    windowRefresh() {
        window.location.reload();
    }
}
