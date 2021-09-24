import { TestBed } from '@angular/core/testing';

import { WordValidationService } from './word-validation.service';

describe('WordValidationService', () => {
    let service: WordValidationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WordValidationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should have a dictionary lenght of at least one', () => {
        expect(service.dicLength).toBeGreaterThanOrEqual(1);
    });
    it('should have a word in the dictionary', () => {
        expect(service.dictionnary.length).toBeGreaterThanOrEqual(1);
    });
    it('isWordValid should return true with aa', () => {
        const isValid = service.isWordValid('aa');
        expect(isValid).toBe(true);
    });
    it('isWordValid should return false with a', () => {
        const isValid = service.isWordValid('a');
        expect(isValid).toBe(false);
    });
    it('isWordValid should return false with abbbb', () => {
        const isValid = service.isWordValid('abbbb');
        expect(isValid).toBe(false);
    });
});
