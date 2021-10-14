import { TestBed } from '@angular/core/testing';

import { StartCounterService } from './start-counter.service';

describe('StartCounterService', () => {
    let service: StartCounterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(StartCounterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
