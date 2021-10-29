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
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
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
        expect(service.players[0].allLettersInHand[0].letter).toEqual('a');
        service.swapLetters(0, 1);
        expect(service.players[0].allLettersInHand[0].letter).toEqual('i');
    });

    it('moveletterright should move letter selected to the right when not on edge', () => {
        service.indexSelectedSwapping = 0;
        expect(service.players[0].allLettersInHand[0].letter).toEqual('a');
        service.moveLetterRight();
        expect(service.players[0].allLettersInHand[1].letter).toEqual('a');
    });

    it('moveletterright should move letter selected at the opposite end when on edge', () => {
        service.indexSelectedSwapping = 2;
        expect(service.players[0].allLettersInHand[0].letter).toEqual('a');
        service.moveLetterRight();
        expect(service.players[0].allLettersInHand[0].letter).toEqual('e');
    });

    it('moveletterleft should move letter selected at the opposite end when on edge', () => {
        service.indexSelectedSwapping = 0;
        expect(service.players[0].allLettersInHand[0].letter).toEqual('a');
        service.moveLetterLeft();
        expect(service.players[0].allLettersInHand[0].letter).toEqual('e');
    });

    it('moveletterleft should move letter selected to the left when not on edge', () => {
        service.indexSelectedSwapping = 2;
        expect(service.players[0].allLettersInHand[2].letter).toEqual('e');
        service.moveLetterLeft();
        expect(service.players[0].allLettersInHand[1].letter).toEqual('e');
    });

    it('select index swapping should check lower half and set index to letter of lower half', () => {
        service.buttonPressed = 'a';
        service.indexSelectedSwapping = 1;
        service.selectIndexSwapping('a');
        expect(service.indexSelectedSwapping).toEqual(0);
    });

    it('select index swapping should check upper half and set index to letter of upper half', () => {
        service.buttonPressed = 'a';
        service.indexSelectedSwapping = 1;
        service.selectIndexSwapping('e');
        expect(service.indexSelectedSwapping).toEqual(2);
    });

    it('select index swapping should check upper half and set index to letter of upper half', () => {
        service.buttonPressed = 'a';
        service.indexSelectedSwapping = 2;
        service.selectIndexSwapping('a');
        expect(service.indexSelectedSwapping).toEqual(0);
    });

    it('setIndexSelectedSwapping should call remove attributes exchange and move letter right if buttonPressed is Arrowright', () => {
        service.indexSelectedSwapping = 2;
        service.isLetterSelectedSwapping = true;
        const mySpy = spyOn(service, 'removeAttributesExchange');
        const mySpy2 = spyOn(service, 'moveLetterRight');
        service.setIndexSelectedSwapping('ArrowRight');
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });

    it('setIndexSelectedSwapping should call remove attributes exchange and move letter left if buttonPressed is ArrowLeft', () => {
        service.indexSelectedSwapping = 2;
        service.isLetterSelectedSwapping = true;
        const mySpy = spyOn(service, 'removeAttributesExchange');
        const mySpy2 = spyOn(service, 'moveLetterLeft');
        service.setIndexSelectedSwapping('ArrowLeft');
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });

    it('setIndexSelectedSwapping should set indexSelectedSwapping to -1 if selectIndexSwapping return is false ', () => {
        service.indexSelectedSwapping = 2;
        const invalidIndex = -1;
        spyOn(service, 'selectIndexSwapping').and.returnValue(false);
        service.setIndexSelectedSwapping('a');
        expect(service.indexSelectedSwapping).toEqual(invalidIndex);
    });

    it('setIndexSelectedSwapping should call remove attributes exchanged if selectIndexSwapping return is true ', () => {
        service.indexSelectedSwapping = 2;
        spyOn(service, 'selectIndexSwapping').and.returnValue(true);
        const mySpy = spyOn(service, 'removeAttributesExchange');
        service.setIndexSelectedSwapping('a');
        expect(mySpy).toHaveBeenCalled();
    });

    it('left click on letter should set isLetterSelectedSwapping to true ', () => {
        service.leftClickOnLetter('a', 1);
        expect(service.isLetterSelectedSwapping).toBeTrue();
    });

    it('right click on letter should isletter remove letter from selection if already selected', () => {
        service.lettersSelectedExchange = 'aie';
        service.indexSelectedExchange = [0, 1, 2];
        service.rightClickOnLetter('i', 1);
        expect(service.lettersSelectedExchange).toEqual('ae');
    });

    it('right click on letter should set is are letter selected for exchange to false if there are none left', () => {
        service.lettersSelectedExchange = 'i';
        service.indexSelectedExchange = [0];
        service.rightClickOnLetter('i', 0);
        expect(service.areLetterSelectedExchange).toBeFalse();
    });

    it('right click on nonselectedletter should set is are letter selected for exchange to true', () => {
        service.lettersSelectedExchange = 'ae';
        service.indexSelectedExchange = [0, 2];
        service.rightClickOnLetter('i', 1);
        expect(service.areLetterSelectedExchange).toBeTrue();
    });

    it('remove attribute swapping should set isletterselectedswapping to false', () => {
        service.removeAttributesSwapping();
        expect(service.isLetterSelectedSwapping).toBeFalse();
    });

    it('remove attribute exchange should set arelettersselected exchange', () => {
        service.removeAttributesExchange();
        expect(service.areLetterSelectedExchange).toBeFalse();
    });
});
