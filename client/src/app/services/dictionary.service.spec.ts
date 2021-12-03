import { TestBed, waitForAsync } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { Observable, of } from 'rxjs';
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
    it('getDictionary should call get full dictionary', () => {
        const dict = new Dictionary('t1', 'd1');
        dict.words = ['aa'];
        communicationServiceSpy.getFullDictionary.and.returnValue(of(dict));
        service.getDictionary();
        expect(communicationServiceSpy.getFullDictionary).toHaveBeenCalled();
    });
    it('isTitlePresent should return true', () => {
        const res = service.isTitlePresent('t1');
        expect(res).toBe(true);
    });
    it('isTitlePresent should return false', () => {
        const res = service.isTitlePresent('t2');
        expect(res).toBe(false);
    });
});
