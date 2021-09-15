import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SoloGameInformationService {
    message: string[] = [];
    private subject = new Subject<string[]>();

    sendMessage(message: string[]) {
        this.subject.next(message);
        this.message = message;
    }

    clearMessages() {
        this.subject.next();
    }

    getMessage(): Observable<string[]> {
        return this.subject.asObservable();
    }
}
