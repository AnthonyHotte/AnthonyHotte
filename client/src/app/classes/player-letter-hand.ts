import { Letter } from '@app/letter';
import { MAXLETTERINHAND } from '@app/constants';
import { BehaviorSubject, Observable } from 'rxjs';
export class PlayerLetterHand {
    static allLetters: Letter[] = []; // all letters in available in bank
    static messageSource: BehaviorSubject<string> = new BehaviorSubject('default message');
    static currentMessage: Observable<string> = PlayerLetterHand.messageSource.asObservable();
    allLettersInHand: Letter[];
    numberLetterInHand: number;
    selectedLettersForExchange: Set<number>;
    score: number;

    constructor() {
        this.allLettersInHand = [];
        this.numberLetterInHand = 0;
        this.score = 0;
        this.selectedLettersForExchange = new Set<number>();
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

    removeLetters() {
        // remove the played letters
        for (const item of this.selectedLettersForExchange.values()) {
            // remove letter in the player hand
            this.allLettersInHand.splice(item, 1);
        }
        // add the letters according to what's bigger 7 or the number of remaining letters
        let i = this.allLettersInHand.length;
        const STOPPING_VALUE = PlayerLetterHand.allLetters.length >= MAXLETTERINHAND ? MAXLETTERINHAND : PlayerLetterHand.allLetters.length;
        while (i < STOPPING_VALUE) {
            const index: number = Math.floor(Math.random() * PlayerLetterHand.allLetters.length);
            // put new letter in player hand
            this.allLettersInHand.push(PlayerLetterHand.allLetters[index]);
            // remove those letter from bag
            PlayerLetterHand.allLetters.splice(index, 1);
            i++;
        }
        this.selectedLettersForExchange.clear();
    }
}
