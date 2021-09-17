import { TestBed } from '@angular/core/testing';

import { SoloOpponentService } from './solo-opponent.service';

describe('SoloOpponentService', () => {
    let service: SoloOpponentService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SoloOpponentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
