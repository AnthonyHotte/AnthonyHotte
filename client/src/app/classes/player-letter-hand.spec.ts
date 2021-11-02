import { TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND } from '@app/constants';
import { LetterBankService } from '@app/services/letter-bank.service';

describe('PlayerLetterHand', () => {
    let playerLetterHand: PlayerLetterHand;
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
        playerLetterHand = new PlayerLetterHand(letterBankServiceSpy);
    });

    it('should be created', () => {
        expect(playerLetterHand).toBeTruthy();
    });
    it('reset should empty allLettersInHand', () => {
        playerLetterHand.allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        playerLetterHand.reset();
        expect(playerLetterHand.allLettersInHand.length).toEqual(0);
    });

    it('exchangeLetters should call push and slice method', () => {
        // we need to add seven letters so we have at least the equal number of letters to that of the minimum amount which is seven
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'b', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'c', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'd', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'f', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });

        playerLetterHand.allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const spyPush = spyOn(playerLetterHand.allLettersInHand, 'push');
        const spySplice = spyOn(playerLetterHand.allLettersInHand, 'splice');
        const expectedCallTime = 2;
        playerLetterHand.exchangeLetters('ae');
        expect(spyPush).toHaveBeenCalledTimes(expectedCallTime);
        expect(spySplice).toHaveBeenCalledTimes(expectedCallTime);
    });

    it('exchangeLetters should call pushTheseLetterToPlayerHand if there are 2 parameters', () => {
        // we need to add seven letters so we have at least the equal number of letters to that of the minimum amount which is seven
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'b', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'c', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'd', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'f', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });

        playerLetterHand.allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const spyPush = spyOn(playerLetterHand, 'addLetterToHand');
        playerLetterHand.exchangeLetters('ae', 'ie');
        expect(spyPush).toHaveBeenCalled();
    });
    it('exchangeLetters is not possible when the bag has less than 7 letters', () => {
        letterBankServiceSpy.letterBank = [];
        playerLetterHand.allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const spyPush = spyOn(playerLetterHand.allLettersInHand, 'push');
        const spySplice = spyOn(playerLetterHand.allLettersInHand, 'splice');
        const expectedCallTime = 0;
        playerLetterHand.exchangeLetters('ae');
        expect(spyPush).toHaveBeenCalledTimes(expectedCallTime);
        expect(spySplice).toHaveBeenCalledTimes(expectedCallTime);
    });
    it('addLetters should call push method', () => {
        // we need to add seven letters so we have at least the equal number of letters to that of the minimum amount which is seven
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'b', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'c', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'd', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'f', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        playerLetterHand.allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        const spyPush = spyOn(playerLetterHand.allLettersInHand, 'push');
        const letterToAdd = 4;
        playerLetterHand.addLetters(letterToAdd);
        expect(spyPush).toHaveBeenCalledTimes(letterToAdd);
    });
    it('addLetters should call push method 0 times when pass 8', () => {
        const spyPush = spyOn(playerLetterHand.allLettersInHand, 'push');
        const letterToAdd = 8;
        playerLetterHand.addLetters(letterToAdd);
        expect(spyPush).toHaveBeenCalledTimes(0);
    });
    it('removeLetters should change letter when at least 7 letters available', () => {
        // we need to add seven letters so we have at least the equal number of letters to that of the minimum amount which is seven
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'b', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'c', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'd', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'f', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        playerLetterHand.allLettersInHand = [
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
            { letter: 'n', quantity: 1, point: 1 },
            { letter: 'j', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
            { letter: 'u', quantity: 1, point: 1 },
            { letter: 'r', quantity: 1, point: 1 },
        ];
        const lettersToRemove = 'bon';
        const expectedLetterInBag = letterBankServiceSpy.letterBank.length - lettersToRemove.length;
        playerLetterHand.removeLetters(lettersToRemove);
        expect(playerLetterHand.allLettersInHand.length).toEqual(MAXLETTERINHAND);
        expect(letterBankServiceSpy.letterBank.length).toEqual(expectedLetterInBag);
    });

    it('removeLetters should change letter when at least 7 letters available', () => {
        // we need to add seven letters so we have at least the equal number of letters to that of the minimum amount which is seven
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'b', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'c', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'd', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'f', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        playerLetterHand.allLettersInHand = [
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
            { letter: 'n', quantity: 1, point: 1 },
            { letter: 'j', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
            { letter: 'u', quantity: 1, point: 1 },
            { letter: 'r', quantity: 1, point: 1 },
        ];
        const lettersToRemove = 'bon';
        const expectedLetterInBag = letterBankServiceSpy.letterBank.length - lettersToRemove.length;
        playerLetterHand.removeLetters(lettersToRemove);
        expect(playerLetterHand.allLettersInHand.length).toEqual(MAXLETTERINHAND);
        expect(letterBankServiceSpy.letterBank.length).toEqual(expectedLetterInBag);
    });

    it('removeLetters should call pushthese letters in hand when there are 2 parameters', () => {
        // we need to add seven letters so we have at least the equal number of letters to that of the minimum amount which is seven
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'b', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'c', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'd', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'f', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        playerLetterHand.allLettersInHand = [
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
            { letter: 'n', quantity: 1, point: 1 },
            { letter: 'j', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
            { letter: 'u', quantity: 1, point: 1 },
            { letter: 'r', quantity: 1, point: 1 },
        ];
        const mySpy = spyOn(playerLetterHand, 'addLetterToHand');
        playerLetterHand.removeLetters('bon', 'abc');
        expect(mySpy).toHaveBeenCalled();
    });
    it('removeLetters should change letter for exchange when less then 7 letters available', () => {
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'b', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'c', quantity: 1, point: 1 });
        playerLetterHand.allLettersInHand = [
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
            { letter: 'n', quantity: 1, point: 1 },
            { letter: 'j', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
            { letter: 'u', quantity: 1, point: 1 },
            { letter: 'r', quantity: 1, point: 1 },
        ];

        const lettersToRemove = 'bonj';
        const expectedLetterInBag = 0;
        const expectedLetterInHand = playerLetterHand.allLettersInHand.length - lettersToRemove.length + letterBankServiceSpy.letterBank.length;
        playerLetterHand.removeLetters(lettersToRemove);
        expect(playerLetterHand.allLettersInHand.length).toEqual(expectedLetterInHand);
        expect(letterBankServiceSpy.letterBank.length).toEqual(expectedLetterInBag);
    });
    // Need to talk to the group for this one
    it('removeLettersForThreeSeconds should call push and slice 4 times', () => {
        playerLetterHand.allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
            { letter: 'l', quantity: 1, point: 1 },
            { letter: 'o', quantity: 1, point: 1 },
        ];
        const expectedCall = 4;
        // const pushSpy = spyOn(playerLetterHand.allLettersInHand, 'push');
        const spliceSpy = spyOn(playerLetterHand.allLettersInHand, 'splice');
        playerLetterHand.removeLettersForThreeSeconds('ailo');
        expect(spliceSpy).toHaveBeenCalledTimes(expectedCall);
        // expect(pushSpy).toHaveBeenCalledTimes(expectedCall);
    });
    it('removeLettersForThreeSeconds should call push and slice 0 times', () => {
        playerLetterHand.allLettersInHand = [
            { letter: 'u', quantity: 1, point: 1 },
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'k', quantity: 1, point: 1 },
            { letter: 'j', quantity: 1, point: 1 },
        ];
        const expectedCall = 0;
        const spliceSpy = spyOn(playerLetterHand.allLettersInHand, 'splice');
        playerLetterHand.removeLettersForThreeSeconds('allo');
        expect(spliceSpy).toHaveBeenCalledTimes(expectedCall);
    });

    it('pushTheseLetterToPlayerHand should call getindexofALetterinBank', () => {
        letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'b', quantity: 1, point: 1 });
        letterBankServiceSpy.letterBank.push({ letter: 'c', quantity: 1, point: 1 });
        playerLetterHand.allLettersInHand = [
            { letter: 'u', quantity: 1, point: 1 },
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'k', quantity: 1, point: 1 },
            { letter: 'j', quantity: 1, point: 1 },
        ];
        playerLetterHand.addLetterToHand('a');
        expect(playerLetterHand.allLettersInHand[playerLetterHand.allLettersInHand.length - 1].letter.toLowerCase()).toEqual('a');
    });

    it('pushTheseLetterToPlayerHand should call getindexofALetterinBank', () => {
        playerLetterHand.allLettersInHand = [
            { letter: 'u', quantity: 1, point: 1 },
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'k', quantity: 1, point: 1 },
            { letter: 'j', quantity: 1, point: 1 },
        ];
        const mySpy = spyOn(playerLetterHand.allLettersInHand, 'splice');
        playerLetterHand.removeLettersWithoutReplacingThem('b');
        expect(mySpy).toHaveBeenCalled();
    });
});
