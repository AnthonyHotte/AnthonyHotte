import { Component, OnInit } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { Letter } from '@app/letter';
import { Subscription } from 'rxjs';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';

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

    constructor(private letterService: LetterService, private soloPlayer: SoloPlayerService, private soloOpponent: SoloOpponentService) {
        this.maxLettersInHand = this.letterService.maxLettersInHand; // constant that is supposed to be in the constant file
        this.currentLetterNumber = this.letterService.currentLetterNumberForPlayer;
    }

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
        this.getNewLetters(this.maxLettersInHand);
        this.subscription = this.letterService.currentMessage.subscribe((message) => (this.message = message));
    }
}
