import { Injectable } from '@angular/core';
import { LETTERS } from '@app/all-letters';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { Letter } from '@app/letter';
import { LetterBankService } from '@app/services/letter-bank.service';
import { Subscription } from 'rxjs';
import { SocketService } from './socket.service';

@Injectable({
    providedIn: 'root',
})
export class LetterService {
    players: PlayerLetterHand[]; // index 0 for the real player, index 1 for the computer
    buttonPressed: string = ''; // the last button that was pressed by the user.
    indexSelectedSwapping: number; // the index of the letter that is currently selected in his hand
    isLetterSelectedSwapping: boolean;
    indexSelectedExchange: number[];
    lettersSelectedExchange = '';
    areLetterSelectedExchange: boolean;
    playerNameZeroSubscription: Subscription;
    playerNameOneSubscription: Subscription;

    constructor(private letterBankService: LetterBankService, private socketService: SocketService) {
        this.players = [new PlayerLetterHand(letterBankService), new PlayerLetterHand(letterBankService)];
        this.isLetterSelectedSwapping = false;
        this.areLetterSelectedExchange = false;
        this.indexSelectedExchange = [];
        this.playerNameZeroSubscription = this.socketService.playerNameIndexZer0.subscribe((playerName) => {
            this.players[0].name = playerName;
        });
        this.playerNameOneSubscription = this.socketService.playerNameIndexOne.subscribe((playerName) => {
            this.players[1].name = playerName;
        });
    }
    reset() {
        this.letterBankService.letterBank = [];
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.letterBankService.letterBank.push(letter);
            }
        });
        for (let i = 0; i < 2; i++) {
            this.players[i].reset();
        }
    }

    // only function for synch : only used by joiner
    synchLetters(lettersCreator: string, lettersJoiner: string) {
        this.resetLetterBankForSynch();
        this.players[1].pushTheseLetterToPlayerHand(letters); // with the letters of creator
        const FULL_HAND = 7;
        this.players[0].addLetters(FULL_HAND); // letters of joiner
    }

    returnLettersOfOpponent() {
        for (const letter of this.players[1].allLettersInHand) {
            this.letterBankService.letterBank.push(letter);
        }
        this.players[1].allLettersInHand = [];
    }

    resetLetterBankForSynch() {
        this.letterBankService.letterBank = [];
        LETTERS.forEach((letter) => {
            for (let i = 0; i < letter.quantity; i++) {
                this.letterBankService.letterBank.push(letter);
            }
        });
        this.players[0].allLettersInHand = [];
        this.players[1].allLettersInHand = [];
    }

    swapLetters(index1: number, index2: number): void {
        const tempLetter: Letter = this.players[0].allLettersInHand[index1];
        this.players[0].allLettersInHand[index1] = this.players[0].allLettersInHand[index2];
        this.players[0].allLettersInHand[index2] = tempLetter;
    }

    moveLetterRight() {
        if (this.indexSelectedSwapping === this.players[0].allLettersInHand.length - 1) {
            this.swapLetters(this.indexSelectedSwapping, 0);
            this.indexSelectedSwapping = 0;
        } else {
            this.swapLetters(this.indexSelectedSwapping, this.indexSelectedSwapping + 1);
            this.indexSelectedSwapping++;
        }
    }

    moveLetterLeft() {
        if (this.indexSelectedSwapping === 0) {
            this.swapLetters(this.players[0].allLettersInHand.length - 1, 0);
            this.indexSelectedSwapping = this.players[0].allLettersInHand.length - 1;
        } else {
            this.swapLetters(this.indexSelectedSwapping, this.indexSelectedSwapping - 1);
            this.indexSelectedSwapping--;
        }
    }

    selectIndexSwapping(buttonPressed: string): boolean {
        let i = 0;
        let checkLowerHalf = true;
        let letterIsThere = false;
        if (this.buttonPressed.toLowerCase() === buttonPressed.toLowerCase()) {
            if (this.indexSelectedSwapping === this.players[0].allLettersInHand.length - 1) {
                i = 0;
            } else {
                i = this.indexSelectedSwapping + 1;
            }
        }
        for (i; i < this.players[0].allLettersInHand.length; i++) {
            if (buttonPressed.toLowerCase() === this.players[0].allLettersInHand[i].letter.toLowerCase()) {
                this.indexSelectedSwapping = i;
                this.buttonPressed = buttonPressed;
                letterIsThere = true;
                this.isLetterSelectedSwapping = true;
                checkLowerHalf = false;
                break;
            }
        }
        if (checkLowerHalf) {
            for (let j = 0; j < i; j++) {
                if (typeof this.players[0].allLettersInHand[j].letter !== 'undefined') {
                    if (buttonPressed.toLowerCase() === this.players[0].allLettersInHand[j].letter.toLowerCase()) {
                        this.indexSelectedSwapping = j;
                        letterIsThere = true;
                        this.isLetterSelectedSwapping = true;
                        break;
                    }
                }
            }
        }
        return letterIsThere;
    }

    setIndexSelectedSwapping(buttonPressed: string): void {
        if (buttonPressed === 'ArrowRight' && typeof this.indexSelectedSwapping !== 'undefined' && this.isLetterSelectedSwapping) {
            this.removeAttributesExchange();
            this.moveLetterRight();
        } else if (buttonPressed === 'ArrowLeft' && typeof this.indexSelectedSwapping !== 'undefined' && this.isLetterSelectedSwapping) {
            this.removeAttributesExchange();
            this.moveLetterLeft();
        } else {
            const playerHasLetter = this.selectIndexSwapping(buttonPressed);
            if (!playerHasLetter) {
                this.buttonPressed = '';
                this.isLetterSelectedSwapping = false;
                this.indexSelectedSwapping = -1;
            } else {
                this.removeAttributesExchange();
            }
        }
    }
    leftClickOnLetter(letter: string, index: number) {
        this.indexSelectedSwapping = index;
        this.isLetterSelectedSwapping = true;
        this.buttonPressed = letter.toLowerCase();
    }

    rightClickOnLetter(letter: string, index: number) {
        if (this.indexSelectedExchange.includes(index)) {
            for (let i = 0; i < this.indexSelectedExchange.length; i++) {
                if (this.indexSelectedExchange[i] === index) {
                    this.lettersSelectedExchange = this.removeCharFromString(this.lettersSelectedExchange, i);
                    this.indexSelectedExchange.splice(i, 1);
                    break;
                }
            }
            if (this.lettersSelectedExchange.length === 0) {
                this.areLetterSelectedExchange = false;
            }
        } else {
            this.indexSelectedExchange.push(index);
            this.lettersSelectedExchange += letter.toLowerCase();
            if (this.lettersSelectedExchange.length !== 0) {
                this.areLetterSelectedExchange = true;
            }
        }
    }

    removeAttributesSwapping() {
        this.indexSelectedSwapping = -1;
        this.isLetterSelectedSwapping = false;
        this.buttonPressed = '';
    }
    removeAttributesExchange() {
        this.indexSelectedExchange = [];
        this.areLetterSelectedExchange = false;
        this.lettersSelectedExchange = '';
    }

    transmitLettersJoiner() {
        this.socketService.lettersOfJoiner = this.players[0].allLettersInHand;
    }

    private removeCharFromString(letters: string, index: number): string {
        const temp = letters.split(''); // convert to an array
        temp.splice(index, 1);
        return temp.join(''); // reconstruct the string
    }
}
