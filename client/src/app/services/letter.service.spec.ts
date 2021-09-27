import { TestBed } from '@angular/core/testing';

import { LetterService } from '@app/services/letter.service';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { LETTERS } from '@app/all-letters';

describe('LetterService', () => {
    let service: LetterService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(LetterService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
        expect(PlayerLetterHand.allLetters.length).toBeGreaterThan(0);
    });

    it('reset should call player.reset method', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        service.players[1].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        const mySpy1 = spyOn(service.players[0], 'reset');
        const mySpy2 = spyOn(service.players[1], 'reset');
        service.reset();
        expect(mySpy1).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });

    it('getLettersForExchange should swap letters correctly', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        service.players[0].selectedLettersForExchange = new Set<number>([0, 1]);
        const result = service.getLettersForExchange();
        expect(result.has('i')).toBe(true);
        expect(result.has('a')).toBe(true);
    });
    it('reset should reinitialize PlayerLetterHand.allLetters', () => {
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                PlayerLetterHand.allLetters.push(letter);
            }
        });
        const expectedResult = 102;
        service.reset();
        expect(PlayerLetterHand.allLetters.length).toEqual(expectedResult);
    });
    it('selectLetter should return true when letter is present in hand and not in exchange letters', () => {
        service.players[0].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        const result = service.selectLetter('a', 0);
        expect(service.players[0].selectedLettersForExchange.has(0)).toBe(true);
        expect(result).toBe(true);
    });
    it('selectLetter should return false when letter is present in hand and in exchange letters', () => {
        service.players[0].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        service.players[0].selectedLettersForExchange.add(0);
        const result = service.selectLetter('a', 0);
        expect(service.players[0].selectedLettersForExchange.has(0)).toBe(true);
        expect(result).toBe(false);
    });
});
