import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { Message } from '@app/classes/message';
import { CommunicationService } from '@app/services/communication.service';

fdescribe('CommunicationService', () => {
    let httpMock: HttpTestingController;
    let service: CommunicationService;
    let baseUrl: string;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
        });
        service = TestBed.inject(CommunicationService);
        httpMock = TestBed.inject(HttpTestingController);
        const BASE_URL = 'baseUrl';
        baseUrl = service[BASE_URL];
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should not return any message when sending a POST request (HttpClient called once)', () => {
        const sentMessage: Message = { body: 'Hello', title: 'World' };
        // subscribe to the mocked call
        service.basicPost(sentMessage).subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/example/send`);
        expect(req.request.method).toBe('POST');
        // actually send the request
        req.flush(sentMessage);
    });
    it('getBestScoreLog2990 should call a get request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.getBestScoreLog2990().subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/database/bestscorelog2990`);
        expect(req.request.method).toBe('GET');
    });
    it('getBestScoreClassique should call a get request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.getBestScoreClassique().subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/database/bestscoreclassique`);
        expect(req.request.method).toBe('GET');
    });
    it('getFullDictionary should call a get request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.getFullDictionary(0).subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/dictionary/fulldictionary?indexNumber=0`);
        expect(req.request.method).toBe('GET');
    });
    it('getJVEasyNames should call a get request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.getJVEasyNames().subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/database/jveasynames`);
        expect(req.request.method).toBe('GET');
    });
    it('getJVHardNames should call a get request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.getJVHardNames().subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/database/jvhardnames`);
        expect(req.request.method).toBe('GET');
    });
    it('getDictionaryList should call a get request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.getDictionaryList().subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/dictionary/list`);
        expect(req.request.method).toBe('GET');
    });
    it('sendScoreChanges should call a post request (HttpClient called once)', () => {
        const best = [];
        const nbOfBest = 5;
        for (let i = 0; i < nbOfBest; i++) {
            best.push({ score: i, name: ['t' + i] });
        }
        // subscribe to the mocked call
        service.sendScoreChanges(0, best).subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/database/sendscorechanges`);
        expect(req.request.method).toBe('POST');
    });
    it('sendModifyJVNames should call a post request (HttpClient called once)', () => {
        const names = [];
        const nbOfBest = 5;
        for (let i = 0; i < nbOfBest; i++) {
            const str = 't' + i;
            names.push(str);
        }
        // subscribe to the mocked call
        service.sendModifyJVNames(0, names).subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/database/sendnameschanges`);
        expect(req.request.method).toBe('POST');
    });
    it('sendDictionaryNameChanged should call a post request (HttpClient called once)', () => {
        const toSend = { index: 0, dictionary: new Dictionary('t1', 'd1') };
        // subscribe to the mocked call
        service.sendDictionaryNameChanged(toSend).subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/dictionary/sendnamechange`);
        expect(req.request.method).toBe('POST');
    });
    it('sendDeleteDictionary should call a post request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.sendDeleteDictionary(0).subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/dictionary/senddeletedictionary?indexNumber=0`);
        expect(req.request.method).toBe('DELETE');
    });
    it('reinitialiseDictionary should call a post request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.reinitialiseDictionary().subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/dictionary/sendreinitialise`);
        expect(req.request.method).toBe('POST');
    });
    it('sendNewDictionary should call a post request (HttpClient called once)', () => {
        // subscribe to the mocked call
        service.sendNewDictionary(new Dictionary('t1', 'd1')).subscribe(() => {
            let truthful = true;
            if (truthful) {
                truthful = false;
            }
        }, fail);
        const req = httpMock.expectOne(`${baseUrl}/dictionary/newdictionary`);
        expect(req.request.method).toBe('POST');
    });

    it('should handle http error safely', () => {
        service.basicGet().subscribe((response: Message) => {
            expect(response).toBeUndefined();
        }, fail);

        const req = httpMock.expectOne(`${baseUrl}/example`);
        expect(req.request.method).toBe('GET');
        req.error(new ErrorEvent('Random error occurred'));
    });
});
