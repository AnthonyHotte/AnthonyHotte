import { TestBed } from '@angular/core/testing';

import { BestScoreService } from './best-score.service';

describe('BestScoreService', () => {
    let service: BestScoreService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BestScoreService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
