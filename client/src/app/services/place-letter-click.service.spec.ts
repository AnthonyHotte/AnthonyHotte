import { TestBed } from '@angular/core/testing';

import { PlaceLetterClickService } from './place-letter-click.service';

describe('PlaceLetterClickService', () => {
    let service: PlaceLetterClickService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlaceLetterClickService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
