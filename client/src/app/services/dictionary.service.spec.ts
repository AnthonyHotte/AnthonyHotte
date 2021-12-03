import { TestBed, waitForAsync } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { Observable } from 'rxjs';
import { CommunicationService } from './communication.service';
import { DictionaryService } from './dictionary.service';

describe('DictionaryService', () => {
    let service: DictionaryService;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    beforeEach(
        waitForAsync(() => {
            communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getFullDictionary']);
            communicationServiceSpy.getFullDictionary.and.returnValue(new Observable());
            TestBed.configureTestingModule({
                providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
            }).compileComponents();
        }),
    );
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DictionaryService);
        service.dictionaryList = [];
        service.dictionaryList.push(new Dictionary('t1', 'd1'));
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('isTitlePresent should return false', () => {
        const res = service.isTitlePresent('t2');
        expect(res).toBe(false);
    });
    it('isTitlePresent should return true', () => {
        const res = service.isTitlePresent('t1');
        expect(res).toBe(true);
    });
    it('isTitlePresent should return false', () => {
        const res = service.isTitlePresent('t2');
        expect(res).toBe(false);
    });
    it('should call populate ', () => {
        const res = new Dictionary('t1', 'd1');
        const spy = spyOn(service.dictionaryList, 'push');
        service.populateDictionary(res);
        expect(spy).toHaveBeenCalled();
    });
});
