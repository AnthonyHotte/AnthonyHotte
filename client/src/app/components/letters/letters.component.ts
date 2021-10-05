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

    getIndexSelectedSwapping(): number {
        return this.letterService.indexSelectedSwapping;
    }

    getIndexSelectedExchange(): number[] {
        return this.letterService.indexSelectedExchange;
    }

    selectLetterWithLeftClick(letter: string, index: number) {
        this.letterService.removeAttributesExchange();
        this.letterService.leftClickOnLetter(letter, index);
    }

    selectLetterWithRightClick(letter: string, index: number) {
        this.letterService.removeAttributesSwapping();
        this.letterService.rightClickOnLetter(letter, index);
    }
}
