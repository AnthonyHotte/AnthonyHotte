import { TestBed, waitForAsync } from '@angular/core/testing';
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
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('getDictionary be created', () => {
        service.getDictionary();
        expect(communicationServiceSpy.getFullDictionary).toHaveBeenCalled();
    });
});
