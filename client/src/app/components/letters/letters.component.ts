import { Component, OnInit } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { Letter } from '@app/letter';

@Component({
    selector: 'app-letters',
    templateUrl: './letters.component.html',
    styleUrls: ['./letters.component.scss'],
})
export class LettersComponent implements OnInit {
    letters: Letter[] = []; // the hand of the user
    buttonPressed: string = ''; // the key that is being pressed by the user.
    MAXLETTERSINHAND: number = 7; // constant that is supposed to be in the constant file

    constructor(private letterService: LetterService) {}

    getNewLetters(amount: number): void {
        this.letterService.addLetters(amount);
        this.letters = this.letterService.getLetters();
    }

    getIndexSelected(): number {
        return this.letterService.indexSelected;
    }

    ngOnInit(): void {
        this.getNewLetters(this.MAXLETTERSINHAND);
    }
}
