import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND } from '@app/constants';

fdescribe('PlayerLetterHand', () => {
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
        playerLetterHand.exchangeLetters('ae');
        expect(spyPush).toHaveBeenCalledTimes(expectedCallTime);
        expect(spySplice).toHaveBeenCalledTimes(expectedCallTime);
    });
    it('exchangeLetters is not possible when the bag has less than 7 letters', () => {
        PlayerLetterHand.allLetters = [];
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
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'b', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'c', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'd', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'f', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
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
        const expectedLetterInBag = PlayerLetterHand.allLetters.length - lettersToRemove.length;
        playerLetterHand.removeLetters(lettersToRemove);
        expect(playerLetterHand.allLettersInHand.length).toEqual(MAXLETTERINHAND);
        expect(PlayerLetterHand.allLetters.length).toEqual(expectedLetterInBag);
    });
    it('removeLetters should change letter for exchange when less then 7 letters available', () => {
        PlayerLetterHand.allLetters.push({ letter: 'a', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'b', quantity: 1, point: 1 });
        PlayerLetterHand.allLetters.push({ letter: 'c', quantity: 1, point: 1 });
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
        const expectedLetterInHand = playerLetterHand.allLettersInHand.length - lettersToRemove.length + PlayerLetterHand.allLetters.length;
        playerLetterHand.removeLetters(lettersToRemove);
        expect(playerLetterHand.allLettersInHand.length).toEqual(expectedLetterInHand);
        expect(PlayerLetterHand.allLetters.length).toEqual(expectedLetterInBag);
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
});
