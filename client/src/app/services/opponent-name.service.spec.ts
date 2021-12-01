import { TestBed } from '@angular/core/testing';

import { OpponentNameService } from './opponent-name.service';

describe('OpponentNameService', () => {
    let service: OpponentNameService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(OpponentNameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
