import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { CommunicationService } from './communication.service';

import { OpponentNameService } from './opponent-name.service';

fdescribe('OpponentNameService', () => {
    let service: OpponentNameService;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    beforeEach(
        waitForAsync(() => {
            communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getJVEasyNames', 'getJVHardNames']);
            communicationServiceSpy.getJVEasyNames.and.returnValue(new Observable());
            communicationServiceSpy.getJVHardNames.and.returnValue(new Observable());
            TestBed.configureTestingModule({
                providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
                imports: [HttpClientTestingModule],
            }).compileComponents();
        }),
    );
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OpponentNameService);
        service.beginnerName = ['Haruki', 'Daphne'];
        service.expertName = ['Tryphon', 'Archibald'];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('getOpponentName should return a name taht is different from the name it has in parameter in beginner mode', () => {
        expect(service.getOpponentName('haruki', false)).not.toEqual('Haruki');
    });
    it('getOpponentName should return a name taht is different from the name it has in parameter in expert mode', () => {
        expect(service.getOpponentName('tryphon', true)).not.toEqual('Tryphon');
    });
});
