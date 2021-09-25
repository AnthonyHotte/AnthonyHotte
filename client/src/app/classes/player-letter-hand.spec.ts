import { PlayerLetterHand } from '@app/classes/player-letter-hand';

describe('PlayerLetterHand', () => {
    let playerLetterHand: PlayerLetterHand;

    beforeEach(() => {
        playerLetterHand = new PlayerLetterHand();
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
});
