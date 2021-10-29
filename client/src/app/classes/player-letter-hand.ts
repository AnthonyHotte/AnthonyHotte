import { LetterMap } from '@app/all-letters';
import { MAXLETTERINHAND } from '@app/constants';
import { Letter } from '@app/letter';
import { LetterBankService } from '@app/services/letter-bank.service';

export class PlayerLetterHand {
    allLettersInHand: Letter[];
    score: number;
    name: string;

    constructor(private letterBankService: LetterBankService) {
        this.allLettersInHand = [];
        this.name = '';
        this.score = 0;
    }

    addLetters(amount: number): void {
        if (this.allLettersInHand.length + amount <= MAXLETTERINHAND) {
            // to make sure there are enough letters available
            const numberLetterToAdd = Math.min(amount, this.letterBankService.letterBank.length);
            let i = 0;
            while (i < numberLetterToAdd) {
                const index: number = Math.floor(Math.random() * this.letterBankService.letterBank.length);
                this.allLettersInHand.push(this.letterBankService.letterBank[index]);
                this.letterBankService.letterBank.splice(index, 1);
                i++;
            }
        }
    }
    exchangeLetters(letters: string, lettersToReplace?: string) {
        // only possible when at least 7 letters are there
        if (this.letterBankService.letterBank.length >= MAXLETTERINHAND && this.handContainLetters(letters)) {
            const numberToExchange = letters.length;
            const lettersExchanged = [];
            // removes letters from hand
            for (const letter of letters) {
                for (let i = 0; i < this.allLettersInHand.length; i++) {
                    if (this.allLettersInHand[i].letter.toLowerCase() === letter) {
                        lettersExchanged.push(letter);
                        this.allLettersInHand.splice(i, 1);
                        break;
                    }
                }
            }
            // eslint-disable-next-line eqeqeq
            if (lettersToReplace == undefined) {
                for (let i = 0; i < numberToExchange; i++) {
                    const index: number = Math.floor(Math.random() * this.letterBankService.letterBank.length);
                    this.allLettersInHand.push(this.letterBankService.letterBank[index]);
                    this.letterBankService.letterBank.splice(index, 1);
                }
            } else {
                this.pushTheseLetterToPlayerHand(lettersToReplace);
            }

            for (const letter of lettersExchanged) {
                const tempLetter = LetterMap.letterMap.letterMap.get(letter) as Letter;
                this.letterBankService.letterBank.push(tempLetter);
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

    removeLetters(lettersToRemove: string, lettersToReplace?: string) {
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
        replaceAmount =
            lettersToRemove.length > this.letterBankService.letterBank.length
                ? (replaceAmount = this.letterBankService.letterBank.length)
                : (replaceAmount = lettersToRemove.length);
        // eslint-disable-next-line eqeqeq
        if (lettersToReplace == undefined) {
            for (let i = 0; i < replaceAmount; i++) {
                const index: number = Math.floor(Math.random() * this.letterBankService.letterBank.length);
                this.allLettersInHand.push(this.letterBankService.letterBank[index]);
                this.letterBankService.letterBank.splice(index, 1);
            }
        } else {
            this.pushTheseLetterToPlayerHand(lettersToReplace);
        }
    }
    pushTheseLetterToPlayerHand(lettersToReplace: string) {
        for (let i = 0; i < lettersToReplace.length; i++) {
            const index = this.letterBankService.getindexofALetterinBank(lettersToReplace.charAt(i));
            this.allLettersInHand.push(this.letterBankService.letterBank[index]);
            this.letterBankService.letterBank.splice(index, 1);
        }
    }
    removeLettersWithoutReplacingThem(lettersToRemove: string) {
        for (let i = 0; i < lettersToRemove.length; i++) {
            for (let j = 0; j < this.allLettersInHand.length; j++) {
                if (this.allLettersInHand[j].letter.toLowerCase() === lettersToRemove.charAt(i)) {
                    this.allLettersInHand.splice(j, 1);
                    break;
                }
            }
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
                const tempLetter = LetterMap.letterMap.letterMap.get(letter) as Letter;
                this.allLettersInHand.push(tempLetter);
            }
        }, TIME_OUT_TIME);
    }
}
