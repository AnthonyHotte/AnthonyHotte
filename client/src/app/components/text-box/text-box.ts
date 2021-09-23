import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TextBox } from '@app/classes/text-box-behavior';
import * as Constants from '@app/constants';
import { ENTER_ASCII } from '@app/constants';
import { GestionTimerTourService } from '@app/services/gestion-timer-tour.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
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
    messageTimeManager: string;
    messageSoloOpponent: string[];
    messageSoloInfo: string[];
    subscriptionPlayer: Subscription;
    subscriptionLetterService: Subscription;
    subscriptionTimeManager: Subscription;
    subscriptionSoloOpponent: Subscription;
    subscriptionTextBox: Subscription;
    word: string;
    array: string[];
    buttonCommandState: string;
    buttonMessageState: string;
    input: TextBox;
    messageTextBox: string;

    debugCommand: boolean;
    turn: number;
    text: string;
    valueToEndGame: number;

    playerName: string;
    oponentName: string;

    constructor(
        private soloPlayer: SoloPlayerService,
        private letterService: LetterService,
        private timeManager: GestionTimerTourService,
        private soloOpponent: SoloOpponentService,
        private soloGameInformation: SoloGameInformationService,
        private link: Router,
        private placeLetter: PlaceLettersService,
    ) {
        this.word = '';
        this.array = [];
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
        // why?
        this.input = new TextBox(this.placeLetter);
        this.debugCommand = false;
        this.messageSoloInfo = this.soloGameInformation.message;
        this.input.currentMessage.subscribe((messageTextBox) => (this.messageTextBox = messageTextBox));
    }

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (event.key.charCodeAt(0) === ENTER_ASCII) {
            this.input.send(this.word);
            this.word = this.input.getWord();
            this.array = this.input.getArray();
            this.buttonCommandState = this.input.getButtonCommandState();
            this.buttonMessageState = this.input.getButtonMessageState();
            this.debugCommand = this.input.getDebugCommand();
        }
    }

    ngOnInit() {
        this.subscriptionPlayer = this.soloPlayer.currentMessage.subscribe((messagePlayer) => (this.messagePlayer = messagePlayer));
        this.subscriptionLetterService = this.letterService.currentMessage.subscribe(
            (messageLetterService) => (this.messageLetterService = messageLetterService),
        );
        this.subscriptionTimeManager = this.timeManager.currentMessage.subscribe(
            (messageTimeManager) => (this.messageTimeManager = messageTimeManager),
        );
        this.subscriptionSoloOpponent = this.soloOpponent.messageTextBox.subscribe(
            (messageSoloOpponent) => (this.messageSoloOpponent = messageSoloOpponent),
        );
        this.subscriptionTextBox = this.input.currentMessage.subscribe((messageTextBox) => (this.messageTextBox = messageTextBox));
        this.turn = this.timeManager.turn;
        this.valueToEndGame = 0;
    }

    activateCommand() {
        this.input.activateCommandButton();
    }

    activateMessage() {
        this.input.activateMessageButton();
    }

    verifyCommand(word: string) {
        this.input.commandSuccessful = false;
        this.turn = this.timeManager.turn;
        const pass = '!passer';
        const exchange = '!échanger';
        const NOT_PRESENT = -1;
        if (this.buttonCommandState === 'ButtonCommandActivated') {
            this.text = 'Entrée invalide.';
        }
        if (this.buttonCommandState === 'ButtonCommandActivated' && this.turn === 0) {
            if (word === pass) {
                this.verifyCommandPasser();
            } else if (word.search(exchange) !== NOT_PRESENT) {
                this.verifyCommandEchanger(word);
            } else if (word.substring(0, Constants.PLACERCOMMANDLENGTH) === '!placer') {
                this.text = this.input.returnMessage;
            } else {
                this.text = 'Erreur de syntaxe...';
            }
        } else if (this.buttonCommandState === 'ButtonCommandActivated' && this.turn !== 0 && word !== '!debug') {
            this.text = 'Commande impossible a réaliser...';
        }
        this.input.sendExecutedCommand();
    }

    verifyCommandPasser() {
        this.soloPlayer.incrementPassedTurns(this.soloOpponent.valueToEndGame, this.soloOpponent.lastTurnWasASkip);
        if (this.valueToEndGame < this.soloPlayer.maximumAllowedSkippedTurns) {
            this.endTurn();
            this.text = 'Tour passé avec succès.';
            this.input.commandSuccessful = true;
        } else {
            this.finishCurrentGame();
        }
        this.text = '';
    }

    verifyCommandEchanger(word: string) {
        const ALLOWED_NUMBER_OF_LETTERS = 7;
        if (word !== undefined && word.length <= ALLOWED_NUMBER_OF_LETTERS + '!échanger '.length && word.length > '!échanger '.length) {
            if (this.letterService.allLetters.length >= ALLOWED_NUMBER_OF_LETTERS) {
                let playerHasLetters = true;
                const letters = word.substring('!échanger '.length, word.length);
                for (let i = 0; i < letters.length; i++) {
                    const letter = letters.charAt(i);
                    playerHasLetters = this.letterService.selectIndex(letter) && playerHasLetters;
                    if (!playerHasLetters) {
                        this.letterService.buttonPressed = '';
                        this.letterService.letterIsSelected = false;
                        this.letterService.indexSelected = -1;
                        this.text = 'Erreur! Les lettres sélectionnées ne font pas partie de la main courante.';
                    } else {
                        this.letterService.setIndexSelected(letter);
                        this.letterService.selectedLettersForExchangePlayer.add(this.letterService.indexSelected);
                    }
                }
                if (playerHasLetters) {
                    this.soloPlayer.exchangeLetters();
                    this.endTurn();
                    this.text = 'Échange de lettre avec succès.';
                    this.input.commandSuccessful = true;
                } else {
                    this.letterService.selectedLettersForExchangePlayer.clear();
                }
            } else {
                this.text = 'Commande impossible à réaliser! La réserve ne contient pas assez de lettres.';
            }
        } else {
            this.text = 'Commande impossible à réaliser! La commande entrée est invalide.';
        }
    }

    finishCurrentGame() {
        this.link.navigate(['home']);
    }

    getText() {
        if (this.buttonCommandState === 'ButtonCommandActivated' && !this.debugCommand) {
            const temp = this.text.toString();
            return temp.toString();
        }
        return '';
    }

    endTurn() {
        this.timeManager.endTurn();
        this.turn = this.timeManager.turn;
        if (this.turn === 0) {
            this.soloPlayer.changeTurn(this.turn.toString());
        } else {
            this.soloOpponent.changeTurn(this.turn.toString());
        }
    }

    getMessageSoloOpoonent() {
        if (parseInt(this.messageSoloOpponent[1], 10) > 0) {
            return 'commande: ' + this.messageSoloOpponent[0] + ' nombre de lettre(s) échangée(s): ' + this.messageSoloOpponent[1];
        } else {
            return 'commande: ' + this.messageSoloOpponent[0];
        }
    }
}
