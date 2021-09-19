import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TextBox } from '@app/classes/text-box-behavior';
import { ENTER_ASCII } from '@app/constants';
import { GestionTimerTourService } from '@app/services/gestion-timer-tour.service';
import { LetterService } from '@app/services/letter.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { Subscription } from 'rxjs';



@Component({
    selector: 'app-text-box',
    templateUrl: './text-box.html',
    styleUrls: ['./text-box.scss'],
})
export class TextBoxComponent implements OnInit {
    messagePlayer: string;
    messageLetterService: string;
    messageTimeMenager: string;
    subscriptionPlayer: Subscription;
    subscriptionLetterService: Subscription;
    subscriptionTimeMenager: Subscription;
    word: string;
    array: string[];
    buttonCommandState: string;
    buttonMessageState: string;
    input: TextBox;
    turn: number;
    text: string;

    constructor(
        private soloPlayer: SoloPlayerService,
        private letterService: LetterService,
        private timeMenager: GestionTimerTourService,
        private link: Router,
    ) {
        this.word = '';
        this.array = [];
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
        this.input = new TextBox();
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.key.charCodeAt(0) === ENTER_ASCII) {
            this.input.send(this.word);
            this.word = this.input.getWord();
            this.array = this.input.getArray();
            this.buttonCommandState = this.input.getButtonCommandState();
            this.buttonMessageState = this.input.getButtonMessageState();
        }
    }

    ngOnInit() {
        this.subscriptionPlayer = this.soloPlayer.currentMessage.subscribe((messagePlayer) => (this.messagePlayer = messagePlayer));
        this.subscriptionLetterService = this.letterService.currentMessage.subscribe(
            (messageLetterService) => (this.messageLetterService = messageLetterService),
        );
        this.subscriptionTimeMenager = this.timeMenager.currentMessage.subscribe(
            (messageTimeMenager) => (this.messageTimeMenager = messageTimeMenager),
        );
        this.turn = this.timeMenager.turn;
    }

    activateCommand() {
        this.input.activateCommandButton();
    }

    activateMessage() {
        this.input.activateMessageButton();
    }

    verifyCommandPassActiveTurn() {
        const pass = '!passer';
        this.turn = this.timeMenager.turn;
        this.text = 'Tour de votre adversaire...';
        if (this.buttonCommandState === 'ButtonCommandActivated' && this.turn === 0) {
            if (this.array[0] === pass) {
                if (this.soloPlayer.valueToEndGame < 2) {
                    this.timeMenager.endTurn();
                    this.turn = this.timeMenager.turn;
                    this.soloPlayer.changeTurn(this.turn.toString());
                    this.soloPlayer.incrementPassedTurns();
                } else {
                    this.finishCurrentGame();
                }
                this.text = 'Tour passé avec succès!';
            } else {
                this.text = 'La commande est invalide!';
            }
        }
    }

    finishCurrentGame() {
        this.link.navigate(['home']);
    }

    getText() {
        if (this.buttonCommandState === 'ButtonCommandActivated') {
            const temp = this.text;
            return temp;
        }
        return '';
    }
}
