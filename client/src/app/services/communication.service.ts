import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BestScore } from '@app/classes/best-score';
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
    getBestScoreLog2990(): Observable<BestScore[]> {
        return this.http
            .get<BestScore[]>(`${this.baseUrl}/database/bestscorelog2990`)
            .pipe(catchError(this.handleError<BestScore[]>('getBestScoreLog2990')));
    }
    getBestScoreClassique(): Observable<BestScore[]> {
        return this.http
            .get<BestScore[]>(`${this.baseUrl}/database/bestscoreclassique`)
            .pipe(catchError(this.handleError<BestScore[]>('getBestScoreClassique')));
    }
    // modeJV = 0 for classique and 1 for log2990
    sendScoreChanges(mode: number, bestScore: BestScore[]): Observable<void> {
        const info = { scoreMode: mode, best: bestScore };
        return this.http.post<void>(`${this.baseUrl}/database/sendscorechanges`, info).pipe(catchError(this.handleError<void>('sendScoreChanges')));
    }
    getJVEasyNames(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/database/jveasynames`).pipe(catchError(this.handleError<string[]>('getJVEasyNames')));
    }
    getJVHardNames(): Observable<string[]> {
        return this.http.get<string[]>(`${this.baseUrl}/database/jvhardnames`).pipe(catchError(this.handleError<string[]>('getJVHardNames')));
    }
    getDictionaryList(): Observable<Dictionary[]> {
        return this.http.get<Dictionary[]>(`${this.baseUrl}/dictionary/list`).pipe(catchError(this.handleError<Dictionary[]>('getDictionary')));
    }
    getFullDictionary(index: number): Observable<Dictionary> {
        const params = new HttpParams().append('indexNumber', index);
        return this.http
            .get<Dictionary>(`${this.baseUrl}/dictionary/fulldictionary`, { params })
            .pipe(catchError(this.handleError<Dictionary>('getFullDictionary')));
    }
    // modeJV = 0 for easy and 1 for hard
    sendModifyJVNames(modeJV: number, names: string[]): Observable<void> {
        const info = { jvLevel: modeJV, jvNames: names };
        return this.http.post<void>(`${this.baseUrl}/database/sendnameschanges`, info).pipe(catchError(this.handleError<void>('sendModifyJVNames')));
    }

    sendDictionaryNameChanged(dictionaryInfo: SendModifyDictionary): Observable<void> {
        return this.http
            .post<void>(`${this.baseUrl}/dictionary/sendnamechange`, dictionaryInfo)
            .pipe(catchError(this.handleError<void>('sendDictionaryNameChanged')));
    }
    sendDeleteDictionary(index: number): Observable<void> {
        const params = new HttpParams().append('indexNumber', index);
        return this.http
            .delete(`${this.baseUrl}/dictionary/senddeletedictionary`, { params })
            .pipe(catchError(this.handleError<void>('sendDeleteDictionary'))) as Observable<void>;
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
