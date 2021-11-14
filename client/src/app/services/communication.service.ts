import { HttpClient, HttpParams } from '@angular/common/http';
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
    getDictionaryList(): Observable<Dictionary[]> {
        return this.http.get<Dictionary[]>(`${this.baseUrl}/dictionary/list`).pipe(catchError(this.handleError<Dictionary[]>('getDictionary')));
    }
    getFullDictionary(index: number): Observable<Dictionary> {
        const params = new HttpParams().append('indexNumber', index);
        return this.http
            .get<Dictionary>(`${this.baseUrl}/dictionary/fulldictionary`, { params })
            .pipe(catchError(this.handleError<Dictionary>('getFullDictionary')));
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
    reinitialiseDictionary(): Observable<void> {
        return this.http
            .post<void>(`${this.baseUrl}/dictionary/sendreinitialise`, { reinitialise: true })
            .pipe(catchError(this.handleError<void>('reinitialiseDictionary')));
    }
    sendNewDictionary(dictionary: Dictionary): Observable<void> {
        return this.http
            .post<void>(`${this.baseUrl}/dictionary/newdictionary`, dictionary)
            .pipe(catchError(this.handleError<void>('sendNewDictionary')));
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
