import { MAXLETTERINHAND } from '@app/constants';
import { Letter } from '@app/letter';
import { BehaviorSubject, Observable } from 'rxjs';
import { LetterMap } from '@app/all-letters';

export class PlayerLetterHand {
    static allLetters: Letter[] = []; // all letters in available in bank
    static messageSource: BehaviorSubject<string> = new BehaviorSubject('default message');
    static currentMessage: Observable<string> = PlayerLetterHand.messageSource.asObservable();
    allLettersInHand: Letter[];
    numberLetterInHand: number;
    selectedLettersForExchange: Set<number>;
    score: number;
    letterMap: LetterMap;

    constructor() {
        this.allLettersInHand = [];
        this.numberLetterInHand = 0;
        this.score = 0;
        this.selectedLettersForExchange = new Set<number>();
        this.letterMap = new LetterMap();
    }
    static sendLettersInSackNumber() {
        PlayerLetterHand.messageSource.next(PlayerLetterHand.allLetters.length.toString());
    }
    addLetters(amount: number): void {
        if (this.numberLetterInHand + amount <= MAXLETTERINHAND) {
            this.numberLetterInHand += amount;
            for (let i = 0; i < amount; i++) {
                const index: number = Math.floor(Math.random() * PlayerLetterHand.allLetters.length);
                this.allLettersInHand.push(PlayerLetterHand.allLetters[index]);
                PlayerLetterHand.allLetters.splice(index, 1);
            }
            this.sendNumberOfLetters(this.numberLetterInHand.toString());
        }
    }
    exchangeLetters() {
        // only possible when at least 7 letters are there
        // should it not be this.selectedLettersForExchange.length instead of MAXLETTERINHAND
        if (PlayerLetterHand.allLetters.length >= MAXLETTERINHAND) {
            for (const item of this.selectedLettersForExchange.values()) {
                // put the letters in the bag
                PlayerLetterHand.allLetters.push(this.allLettersInHand[item]);
                const index: number = Math.floor(Math.random() * PlayerLetterHand.allLetters.length);
                // remove letter in the player hand
                this.allLettersInHand.splice(item, 1);
                // put new letter in player hand
                this.allLettersInHand.push(PlayerLetterHand.allLetters[index]);
                // remove those letter from bag
                PlayerLetterHand.allLetters.splice(index, 1);
            }
        }
        this.selectedLettersForExchange.clear();
    }
    sendNumberOfLetters(message: string) {
        PlayerLetterHand.messageSource.next(message);
    }
    reset() {
        this.allLettersInHand = []; // array containing the "hand" of the player, the letters he possesses
        this.numberLetterInHand = 0;
        this.selectedLettersForExchange.clear();
    }

    removeLetters(lettersToRemove: string) {
        // remove the played letters
        for (let i = 0; i < lettersToRemove.length; i++) {
            for (let j = 0; j < this.allLettersInHand.length; j++) {
                if (this.allLettersInHand[j].letter.toLowerCase() === lettersToRemove.charAt(i)) {
                    this.allLettersInHand.splice(j, 1);
                    break;
                }
            }
        }
        // add the letters according to what's bigger 7 or the number of remaining letters
        let replaceAmount: number;
        if (lettersToRemove.length > PlayerLetterHand.allLetters.length) {
            replaceAmount = PlayerLetterHand.allLetters.length;
        } else {
            replaceAmount = lettersToRemove.length;
        }
        for (let i = 0; i < replaceAmount; i++) {
            const index: number = Math.floor(Math.random() * PlayerLetterHand.allLetters.length);
            this.allLettersInHand.push(PlayerLetterHand.allLetters[index]);
            PlayerLetterHand.allLetters.splice(index, 1);
        }
    }

    removeLettersForThreeSeconds(word: string) {
        for (let i = 0; i < word.length; i++) {
            for (let j = 0; j < this.allLettersInHand.length; j++) {
                if (this.allLettersInHand[j].letter.toLowerCase() === word.charAt(i)) {
                    this.allLettersInHand.splice(j, 1);
                    break;
                }
            }
        }

        const TIME_OUT_TIME = 3000;
        setTimeout(() => {
            for (const letter of word) {
                const tempLetter = this.letterMap.letterMap.get(letter) as Letter;
                this.allLettersInHand.push(tempLetter);
            }
        }, TIME_OUT_TIME);
    }
}
