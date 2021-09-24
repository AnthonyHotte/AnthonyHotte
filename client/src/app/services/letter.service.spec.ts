import { TestBed } from '@angular/core/testing';

import { LetterService } from '@app/services/letter.service';

describe('LetterService', () => {
    let service: LetterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LetterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('attribute allLetter should not be empty', () => {
        expect(service.allLetters.length).toBeGreaterThan(0);
    });
    it('addLettersForPlayer should do nothing when pass 8', () => {
        const letterToAdd = 8;
        service.addLettersForPlayer(letterToAdd);
        expect(service.currentLetterNumberForPlayer).toEqual(0);
    });
    it('addLettersForPlayer should add 7 letters when pass 7', () => {
        const letterToAdd = 7;
        service.addLettersForPlayer(letterToAdd);
        expect(service.currentLetterNumberForPlayer).toEqual(letterToAdd);
    });
    it('addLettersForOpponent should do nothing when pass 8', () => {
        const letterToAdd = 8;
        service.addLettersForOpponent(letterToAdd);
        expect(service.currentLetterNumberForPlayer).toEqual(0);
    });
    it('addLettersForOpponent should add 7 letters when pass 7', () => {
        const letterToAdd = 7;
        service.addLettersForOpponent(letterToAdd);
        expect(service.currentLetterNumberForPlayer).toEqual(letterToAdd);
    });
});
