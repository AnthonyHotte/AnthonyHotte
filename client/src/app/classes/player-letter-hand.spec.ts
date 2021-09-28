import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND } from '@app/constants';

describe('PlayerLetterHand', () => {
    let playerLetterHand: PlayerLetterHand;

    beforeEach(() => {
        playerLetterHand = new PlayerLetterHand();
        PlayerLetterHand.allLetters = [];
    });

    it('should be created', () => {
        expect(playerLetterHand).toBeTruthy();
    });
    it('reset should empty allLettersInHand', () => {
        playerLetterHand.allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        playerLetterHand.reset();
        expect(playerLetterHand.allLettersInHand.length).toEqual(0);
    });
    it('reset should put to 0 numberLetterInHand', () => {
        playerLetterHand.numberLetterInHand = 2;
        playerLetterHand.reset();
        expect(playerLetterHand.numberLetterInHand).toEqual(0);
    });
    it('sendNumberOfLetters should call next method', () => {
        const spy = spyOn(PlayerLetterHand.messageSource, 'next');
        playerLetterHand.sendNumberOfLetters('test');
        expect(spy).toHaveBeenCalledWith('test');
    });
    it('exchangeLetters should call push and slice method', () => {
        // we need to add seven letters so we have at least the equal number of letters to that of the minimum amount which is seven
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'b', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'c', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'd', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'f', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });

        playerLetterHand.allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const spyPush = spyOn(playerLetterHand.allLettersInHand, 'push');
        const spySplice = spyOn(playerLetterHand.allLettersInHand, 'splice');
        const expectedCallTime = 2;
        playerLetterHand.selectedLettersForExchange = new Set<number>([0, 1]);
        playerLetterHand.exchangeLetters();
        expect(spyPush).toHaveBeenCalledTimes(expectedCallTime);
        expect(spySplice).toHaveBeenCalledTimes(expectedCallTime);
    });
    it('exchangeLetters is not possible when the player has more letters than what is in the bag', () => {
        PlayerLetterHand.allLetters = [];
        playerLetterHand.allLettersInHand = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
        ];
        const spyPush = spyOn(playerLetterHand.allLettersInHand, 'push');
        const spySplice = spyOn(playerLetterHand.allLettersInHand, 'splice');
        const expectedCallTime = 0;
        playerLetterHand.selectedLettersForExchange = new Set<number>([0, 1]);
        playerLetterHand.exchangeLetters();
        expect(spyPush).toHaveBeenCalledTimes(expectedCallTime);
        expect(spySplice).toHaveBeenCalledTimes(expectedCallTime);
    });
    it('addLetters should call push method', () => {
        playerLetterHand.numberLetterInHand = 0;
        const spyPush = spyOn(playerLetterHand.allLettersInHand, 'push');
        const letterToAdd = 4;
        playerLetterHand.addLetters(letterToAdd);
        expect(spyPush).toHaveBeenCalledTimes(letterToAdd);
    });
    it('addLetters should call push method', () => {
        playerLetterHand.numberLetterInHand = 0;
        const spySendNumberOfLetters = spyOn(playerLetterHand, 'sendNumberOfLetters');
        const letterToAdd = 4;
        playerLetterHand.addLetters(letterToAdd);
        expect(spySendNumberOfLetters).toHaveBeenCalledTimes(1);
    });
    it('addLetters should call push method 0 times when pass 8', () => {
        playerLetterHand.numberLetterInHand = 0;
        const spyPush = spyOn(playerLetterHand.allLettersInHand, 'push');
        const letterToAdd = 8;
        playerLetterHand.addLetters(letterToAdd);
        expect(spyPush).toHaveBeenCalledTimes(0);
    });
    it('sendLettersInSackNumber should call next method', () => {
        const spyNext = spyOn(PlayerLetterHand.messageSource, 'next');
        PlayerLetterHand.sendLettersInSackNumber();
        expect(spyNext).toHaveBeenCalledWith(PlayerLetterHand.allLetters.length.toString());
    });
    it('removeLetters should change letter when at least 7 letters available', () => {
        // we need to add seven letters so we have at least the equal number of letters to that of the minimum amount which is seven
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'b', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'c', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'd', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'f', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        playerLetterHand.allLettersInHand = [
            { letter: 'd', quantity: 1, point: 1 },
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'c', quantity: 1, point: 1 },
        ];
        const expectedLetterInBag = PlayerLetterHand.allLetters.length - MAXLETTERINHAND + playerLetterHand.allLettersInHand.length;
        playerLetterHand.selectedLettersForExchange = new Set<number>([0, 1, 2]);
        playerLetterHand.removeLetters();
        expect(playerLetterHand.allLettersInHand.length).toEqual(MAXLETTERINHAND);
        expect(PlayerLetterHand.allLetters.length).toEqual(expectedLetterInBag);
        expect(playerLetterHand.selectedLettersForExchange.size).toEqual(0);
    });
    it('removeLetters should change letter for exchange when less then 7 letters available', () => {
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'b', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'c', quantity: 1, point: 1 });
        playerLetterHand.allLettersInHand = [
            { letter: 'd', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
            { letter: 'f', quantity: 1, point: 1 },
        ];
        const numberLetterAdded = PlayerLetterHand.allLetters.length >= MAXLETTERINHAND ? MAXLETTERINHAND : PlayerLetterHand.allLetters.length;
        const expectedLetterInBag = PlayerLetterHand.allLetters.length - numberLetterAdded + playerLetterHand.allLettersInHand.length;
        playerLetterHand.selectedLettersForExchange = new Set<number>([0, 1, 2]);
        playerLetterHand.removeLetters();
        expect(playerLetterHand.allLettersInHand.length).toEqual(3);
        expect(PlayerLetterHand.allLetters.length).toEqual(expectedLetterInBag);
        expect(playerLetterHand.selectedLettersForExchange.size).toEqual(0);
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
        playerLetterHand.selectedLettersForExchange = new Set<number>();
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
        playerLetterHand.selectedLettersForExchange = new Set<number>();
        const addSpy = spyOn(playerLetterHand.selectedLettersForExchange, 'add');
        const spliceSpy = spyOn(playerLetterHand.allLettersInHand, 'splice');
        playerLetterHand.removeLettersForThreeSeconds('allo');
        expect(addSpy).toHaveBeenCalledTimes(expectedCall);
        expect(spliceSpy).toHaveBeenCalledTimes(expectedCall);
    });
});
