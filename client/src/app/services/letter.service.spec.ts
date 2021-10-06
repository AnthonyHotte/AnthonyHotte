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

    it('reset should reinitialize PlayerLetterHand.allLetters', () => {
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                PlayerLetterHand.allLetters.push(letter);
            }
        });
        // 102 letters in the bag but 14 were distributed to players so we expect 88
        const expectedResult = 88;
        service.reset();
        expect(PlayerLetterHand.allLetters.length).toEqual(expectedResult);
    });
});
