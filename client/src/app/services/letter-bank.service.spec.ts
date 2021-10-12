import { TestBed } from '@angular/core/testing';

import { LetterBankService } from './letter-bank.service';

describe('LetterBankService', () => {
    let service: LetterBankService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LetterBankService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
