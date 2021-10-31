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
    it('getLettersInBank return letter in bank', () => {
        service.letterBank = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const minimaleLenghtString = 52;
        const letterString = service.getLettersInBank();
        expect(typeof letterString).toEqual(typeof 'adf');
        expect(letterString.length).toBeGreaterThan(minimaleLenghtString);
    });

    it('getindexofALetterinBank should return index of letter in bank if its there', () => {
        service.letterBank = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        expect(service.getindexofALetterinBank('e')).toEqual(1);
    });

    it('getindexofALetterinBank should return -1 if letter is not there', () => {
        service.letterBank = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const notAValidIndexvalue = -1;
        expect(service.getindexofALetterinBank('i')).toEqual(notAValidIndexvalue);
    });
});
