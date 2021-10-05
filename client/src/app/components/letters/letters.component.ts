import { Component, OnInit } from '@angular/core';
import * as Constants from '@app/constants';
import { Letter } from '@app/letter';
import { LetterService } from '@app/services/letter.service';

@Component({
    selector: 'app-letters',
    templateUrl: './letters.component.html',
    styleUrls: ['./letters.component.scss'],
})
export class LettersComponent implements OnInit {
    letters: Letter[] = []; // the hand of the user
    maxLettersInHand: number;
    currentLetterNumber: number;
    letterSize: number;

    constructor(private letterService: LetterService) {}
    // call only at the beginning
    getNewLetters(): void {
        this.letters = this.letterService.players[0].allLettersInHand;
    }

    ngOnInit(): void {
        this.letterService.reset();
        this.maxLettersInHand = Constants.MAXLETTERINHAND;
        this.letterSize = Constants.CASESIZE;
        this.getNewLetters();
    }

    getIndexSelected(): number {
        return this.letterService.indexSelected;
    }

    selectLetterWithClick(letter: string, index: number) {
        this.letterService.indexSelected = index;
        this.letterService.letterIsSelected = true;
        this.letterService.buttonPressed = letter.toLowerCase();
    }
}
