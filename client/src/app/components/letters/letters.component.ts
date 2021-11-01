import { Component, OnInit, HostListener } from '@angular/core';
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
    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.letterService.setIndexSelectedSwapping(event.key);
    }

    getNewLetters(): void {
        this.letters = this.letterService.players[0].allLettersInHand;
        //////////////////////////////////////////////////////////////////////////// for debug
        for (const letter of this.letterService.players[1].allLettersInHand) {
            this.letters.push(letter);
        }
        //////////////////////////////////////////////////////////////////////////// for debug
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
