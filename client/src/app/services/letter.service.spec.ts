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
    /* it('setIndexSelected should call moveLetterRight when pass ArrowRight', () => {
        service.letterIsSelected = true;
        service.indexSelected = 1;
        const mySpy = spyOn(service, 'moveLetterRight');
        service.setIndexSelected('ArrowRight');
        expect(mySpy).toHaveBeenCalled();
    });
    it('setIndexSelected should call moveLetterLeft when pass ArrowLeft', () => {
        service.letterIsSelected = true;
        service.indexSelected = 1;
        const mySpy = spyOn(service, 'moveLetterLeft');
        service.setIndexSelected('ArrowLeft');
        expect(mySpy).toHaveBeenCalled();
    });
    it('setIndexSelected should call selectIndex when pass empty string', () => {
        service.letterIsSelected = true;
        service.indexSelected = 1;
        const mySpy = spyOn(service, 'selectIndex');
        service.setIndexSelected('');
        expect(mySpy).toHaveBeenCalled();
    });
    it('selectIndex should put indexSelected attribute to 0 when pass a', () => {
        service.buttonPressed = 'a';
        service.indexSelected = 0;
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        service.selectIndex('a');
        expect(service.indexSelected).toEqual(0);
    });
    it('selectIndex should put indexSelected attribute to 1 when pass e', () => {
        service.buttonPressed = 'e';
        service.indexSelected = 0;
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        service.selectIndex('e');
        expect(service.indexSelected).toEqual(1);
    });
    it('selectIndex should put indexSelected attribute to 1 when pass i', () => {
        service.buttonPressed = 'i';
        service.indexSelected = 1;
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        service.selectIndex('i');
        expect(service.indexSelected).toEqual(1);
    });
    it('reset should put indexSelected attribute to -1', () => {
        const expectedResult = -1;
        service.indexSelected = 1;
        service.reset();
        expect(service.indexSelected).toEqual(expectedResult);
    });
    it('reset should empty buttonPressed attribute', () => {
        const expectedResult = '';
        service.buttonPressed = 'a';
        service.reset();
        expect(service.indexSelected).toMatch(expectedResult);
    });
     */
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
    /*
    it('moveLetterLeft should decremente indexSelected when not at the beginning', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        service.indexSelected = 1;
        service.moveLetterLeft();
        expect(service.indexSelected).toEqual(0);
    });
    it('moveLetterLeft should put indexSelected at the end when initially at 0', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        service.indexSelected = 0;
        service.moveLetterLeft();
        expect(service.indexSelected).toEqual(1);
    });
    it('moveLetterRight should increment indexSelected when not at the beginning', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        service.indexSelected = 0;
        service.moveLetterRight();
        expect(service.indexSelected).toEqual(1);
    });
    it('moveLetterRight should put indexSelected at 0 when initially at the end', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        service.indexSelected = 1;
        service.moveLetterRight();
        expect(service.indexSelected).toEqual(0);
    });
    it('swapLetters should swap letters correctly', () => {
        service.players[0].allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'i', quantity: 1, point: 1 },
        ];
        service.swapLetters(0, 1);
        expect(service.players[0].allLettersInHand[0].letter).toMatch('i');
        expect(service.players[0].allLettersInHand[1].letter).toMatch('a');
    });
    */
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

    /*
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
    */
});
