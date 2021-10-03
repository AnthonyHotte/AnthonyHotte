import { MAXLETTERINHAND } from '@app/constants';
import { Letter } from '@app/letter';
import { LetterMap } from '@app/all-letters';

export class PlayerLetterHand {
    static allLetters: Letter[] = []; // all letters in available in bank
    allLettersInHand: Letter[];
    score: number;
    name: string;
    letterMap: LetterMap;

    constructor() {
        this.allLettersInHand = [];
        this.name = '';
        this.score = 0;
        this.letterMap = new LetterMap();
    }

    addLetters(amount: number): void {
        if (this.allLettersInHand.length + amount <= MAXLETTERINHAND) {
            for (let i = 0; i < amount; i++) {
                const index: number = Math.floor(Math.random() * PlayerLetterHand.allLetters.length);
                this.allLettersInHand.push(PlayerLetterHand.allLetters[index]);
                PlayerLetterHand.allLetters.splice(index, 1);
            }
        }
    }
    exchangeLetters(letters: string) {
        // only possible when at least 7 letters are there
        if (PlayerLetterHand.allLetters.length >= MAXLETTERINHAND && this.handContainLetters(letters)) {
            const numberToExchange = letters.length;
            // removes letters from hand
            for (const letter of letters) {
                for (let i = 0; i < this.allLettersInHand.length; i++) {
                    if (this.allLettersInHand[i].letter.toLowerCase() === letter) {
                        this.allLettersInHand.splice(i, 1);
                        break;
                    }
                }
            }
            for (let i = 0; i < numberToExchange; i++) {
                const index: number = Math.floor(Math.random() * PlayerLetterHand.allLetters.length);
                this.allLettersInHand.push(PlayerLetterHand.allLetters[index]);
                PlayerLetterHand.allLetters.splice(index, 1);
            }
        }
    }

    reset() {
        this.allLettersInHand = []; // array containing the "hand" of the player, the letters he possesses
        this.addLetters(MAXLETTERINHAND);
    }

    handContainLetters(letters: string): boolean {
        const tempHand: string[] = [];
        for (const letter of this.allLettersInHand) {
            tempHand.push(letter.letter.toLowerCase());
        }
        let lettersAreThere = '';
        for (const letter of letters) {
            for (let i = 0; i < tempHand.length; i++) {
                if (tempHand[i] === letter) {
                    lettersAreThere += letter;
                    tempHand.splice(i, 1);
                    break;
                }
            }
        }
        return lettersAreThere.length === letters.length;
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
