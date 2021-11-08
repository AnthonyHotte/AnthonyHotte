import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { Message } from '@app/classes/message';
import { SendModifyDictionary } from '@app/classes/send-dictionary-interface';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class CommunicationService {
    private readonly baseUrl: string = environment.serverUrl;

    constructor(private readonly http: HttpClient) {}
    getDictionary(): Observable<Dictionary[]> {
        return this.http.get<Dictionary[]>(`${this.baseUrl}/dictionary/list`).pipe(catchError(this.handleError<Dictionary[]>('getDictionary')));
    }
    sendDictionaryNameChanged(dictionaryInfo: SendModifyDictionary): Observable<void> {
        return this.http
            .post<void>(`${this.baseUrl}/dictionary/sendnamechange`, dictionaryInfo)
            .pipe(catchError(this.handleError<void>('sendDictionaryNameChanged')));
    }
    sendDeleteDictionary(index: number): Observable<void> {
        const objNumber = { indexNumber: index };
        return this.http
            .post<void>(`${this.baseUrl}/dictionary/senddeletedictionary`, objNumber)
            .pipe(catchError(this.handleError<void>('sendDeleteDictionary')));
    }

    basicGet(): Observable<Message> {
        return this.http.get<Message>(`${this.baseUrl}/example`).pipe(catchError(this.handleError<Message>('basicGet')));
    }

    basicPost(message: Message): Observable<void> {
        return this.http.post<void>(`${this.baseUrl}/example/send`, message).pipe(catchError(this.handleError<void>('basicPost')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return () => of(result as T);
    }
}
