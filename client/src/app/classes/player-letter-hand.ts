import { MAXLETTERINHAND } from '@app/constants';
import { Letter } from '@app/letter';
import { BehaviorSubject, Observable } from 'rxjs';
export class PlayerLetterHand {
    static allLetters: Letter[] = []; // all letters in available in bank
    static messageSource: BehaviorSubject<string> = new BehaviorSubject('default message');
    static currentMessage: Observable<string> = PlayerLetterHand.messageSource.asObservable();
    allLettersInHand: Letter[];
    numberLetterInHand: number;
    selectedLettersForExchange: Set<number>;
    score: number;
    private lettersToRemoveForThreeSeconds: Letter[];

    constructor() {
        this.allLettersInHand = [];
        this.numberLetterInHand = 0;
        this.score = 0;
        this.selectedLettersForExchange = new Set<number>();
        this.lettersToRemoveForThreeSeconds = [];
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

    removeLetters() {
        const lettersExchanged: Letter[] = [];
        // needed for deleting correctly
        let numberOfElementDeleted = 0;
        // remove the played letters
        for (const item of this.selectedLettersForExchange.values()) {
            // remove letter in the player hand
            // [0] is there because slice return an array an we only want the first and unique element
            const letterToChanged: Letter = this.allLettersInHand.splice(item - numberOfElementDeleted, 1)[0];
            numberOfElementDeleted += 1;
            lettersExchanged.push(letterToChanged);
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
        // add the letter that we removed to the bag
        lettersExchanged.forEach((letter) => {
            PlayerLetterHand.allLetters.push(letter);
        });
        this.selectedLettersForExchange.clear();
    }

    removeLettersForThreeSeconds(word: string) {
        word = word.toLowerCase();
        for (let i = 0; i < this.allLettersInHand.length; i++) {
            const temp = this.allLettersInHand[i];
            for (let j = 0; j < word.length; j++) {
                if (temp.letter.toLowerCase() === word.charAt(j) && !this.selectedLettersForExchange.has(i)) {
                    this.selectedLettersForExchange.add(i);
                    this.lettersToRemoveForThreeSeconds.push(temp);
                    word.replace(temp.letter, '');
                }
            }
        }
        for (const item of this.selectedLettersForExchange.values()) {
            this.allLettersInHand.splice(item, 1);
        }
        this.selectedLettersForExchange.clear();
        const TIME_OUT_TIME = 3000;
        setTimeout(() => {
            for (const letter of this.lettersToRemoveForThreeSeconds) {
                this.allLettersInHand.push(letter);
            }
            this.lettersToRemoveForThreeSeconds = [];
        }, TIME_OUT_TIME);
    }
}
