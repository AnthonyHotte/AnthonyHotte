import { TestBed, waitForAsync } from '@angular/core/testing';

import { LetterService } from '@app/services/letter.service';
import { LETTERS } from '@app/all-letters';
import { LetterBankService } from './letter-bank.service';

describe('LetterService', () => {
    let service: LetterService;
    let letterBankServiceSpy: LetterBankService;

    beforeEach(
        waitForAsync(() => {
            letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
            letterBankServiceSpy.letterBank = [];
            TestBed.configureTestingModule({
                providers: [{ provide: LetterBankService, useValue: letterBankServiceSpy }],
            }).compileComponents();
        }),
    );
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
                letterBankServiceSpy.letterBank.push(letter);
            }
        });
        // 102 letters in the bag but 14 were distributed to players so we expect 88
        const expectedResult = 88;
        service.reset();
        expect(letterBankServiceSpy.letterBank.length).toEqual(expectedResult);
    });

    it('swapLetters should swap letters', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        expect(service.players[0].allLettersInHand[0].letter).toEqual('a');
        service.swapLetters(0, 1);
        expect(service.players[0].allLettersInHand[0].letter).toEqual('i');
    });

    it('moveletterright should move letter selected right', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        expect(service.players[0].allLettersInHand[0].letter).toEqual('a');
        service.swapLetters(0, 1);
        expect(service.players[0].allLettersInHand[0].letter).toEqual('i');
    });
});
