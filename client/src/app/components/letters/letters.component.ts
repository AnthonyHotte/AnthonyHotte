import { Component, OnInit } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { Letter } from '@app/letter';
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
    MAXLETTERSINHAND: number = this.letterService.MAXLETTERSINHAND; // constant that is supposed to be in the constant file
    currentLetterNumber: number = this.letterService.currentLetterNumber;

    constructor(private letterService: LetterService) {}

    getNewLetters(amount: number): void {
        if(this.currentLetterNumber <= this.MAXLETTERSINHAND){
            this.letterService.addLetters(amount);
            this.letters = this.letterService.getLetters();
            this.currentLetterNumber = parseInt(this.message);
        }
    }

    getIndexSelected(): number {
        return this.letterService.indexSelected;
    }

    ngOnInit(): void {
        this.getNewLetters(this.MAXLETTERSINHAND);
        this.subscription = this.letterService.currentMessage.subscribe(message => this.message = message);
    }
}
