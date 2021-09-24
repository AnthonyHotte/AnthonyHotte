import { Component, OnInit } from '@angular/core';
import * as Constants from '@app/constants';
import { Letter } from '@app/letter';
import { LetterService } from '@app/services/letter.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-letters',
    templateUrl: './letters.component.html',
    styleUrls: ['./letters.component.scss'],
})
export class LettersComponent implements OnInit {
    message: string;
    subscription: Subscription;
    letters: Letter[] = []; // the hand of the user
    buttonPressed: string = ''; // the key that is being pressed by the user.
    maxLettersInHand: number;
    currentLetterNumber: number;
    letterSize: number;

    constructor(private letterService: LetterService, private soloPlayer: SoloPlayerService, private soloOpponent: SoloOpponentService) {}
    // call only at the beginning
    getNewLetters(amount: number): void {
        if (this.currentLetterNumber + amount <= this.maxLettersInHand) {
            this.soloPlayer.reset();
            this.soloOpponent.reset();
            this.letters = this.letterService.getLetters();
            this.currentLetterNumber = parseInt(this.message, 10);
        }
    }

    getIndexSelected(): number {
        return this.letterService.indexSelected;
    }

    ngOnInit(): void {
        this.letterService.reset();
        this.maxLettersInHand = Constants.MAXLETTERINHAND;
        this.currentLetterNumber = this.letterService.currentLetterNumberForPlayer;
        this.letterSize = Constants.CASESIZE;
        this.getNewLetters(this.maxLettersInHand);
        this.subscription = this.letterService.currentMessage.subscribe((message) => (this.message = message));
    }

    onRightClick(letter: string) {
        this.letterService.setIndexSelected(letter);
        if (this.letterService.selectedLettersForExchangePlayer.has(this.letterService.indexSelected)) {
            this.letterService.selectedLettersForExchangePlayer.delete(this.letterService.indexSelected);
        } else {
            this.letterService.selectedLettersForExchangePlayer.add(this.letterService.indexSelected);
        }
    }
}
