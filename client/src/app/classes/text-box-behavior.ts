import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MAX_CHARACTERS, PLACERCOMMANDLENGTH } from '@app/constants';
import { GestionTimerTourService } from '@app/services/gestion-timer-tour.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerLetterHand } from './player-letter-hand';

@Injectable({
    providedIn: 'root',
})
export class TextBox {
    word: string = '';
    inputs: string[] = [];
    character: boolean = false;
    buttonMessageState: string = 'ButtonMessageActivated';
    buttonCommandState: string = 'ButtonCommandReleased';
    debugCommand: boolean = false;
    returnMessage: string;
    currentMessage: Observable<string>;
    valueToEndGame: number;
    turn: number;

    commandSuccessful: boolean = true;
    sourceMessage = new BehaviorSubject('command is successful');
    constructor(
        private readonly placeLettersService: PlaceLettersService,
        private soloPlayer: SoloPlayerService,
        private soloOpponent: SoloOpponentService,
        private timeManager: GestionTimerTourService,
        private link: Router,
        private letterService: LetterService,
    ) {
        this.word = '';
        this.inputs = [];
        this.character = false;
        this.buttonMessageState = 'ButtonMessageActivated';
        this.buttonCommandState = 'ButtonCommandReleased';
        this.debugCommand = false;
        this.currentMessage = this.sourceMessage.asObservable();
        this.sendExecutedCommand();
        this.valueToEndGame = 0;
        this.turn = this.timeManager.turn;
    }
    send(myWord: string) {
        this.inputVerification(myWord);
        if (this.character === false) {
            this.inputs.push(myWord);
        }
    }
    inputVerification(myWord: string) {
        if (myWord.length > MAX_CHARACTERS) {
            this.character = true;
        } else {
            this.character = false;
        }
    }

    getWord() {
        return this.word;
    }

    getArray() {
        return this.inputs;
    }

    getButtonMessageState() {
        return this.buttonMessageState;
    }

    getButtonCommandState() {
        return this.buttonCommandState;
    }

    activateCommandButton() {
        this.buttonCommandState = 'ButtonCommandActivated';
        this.buttonMessageState = 'ButtonMessageReleased';
    }
    activateMessageButton() {
        this.buttonCommandState = 'ButtonCommandReleased';
        this.buttonMessageState = 'ButtonMessageActivated';
    }

    isCommand(myWord: string) {
        // const test: PlaceLettersService;
        // switch (myWord) {
        // case '!debug':
        let text = '';
        text = 'Commande invalide.';
        this.debugCommand = false;
        if (this.timeManager.turn === 0) {
            if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!debug') {
                text = 'Commande debug activé';
                this.debugCommand = true;
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!placer') {
                this.returnMessage = this.placeLettersService.placeWord(myWord.substring(PLACERCOMMANDLENGTH + 1, myWord.length));
                this.endTurn();
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!passer') {
                text = this.verifyCommandPasser();
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 2) === '!échanger') {
                text = this.verifyCommandEchanger(myWord);
            } else {
                text = 'Erreur de syntaxe...';
            }
        }
        this.inputs.push(text);
    }
    getDebugCommand() {
        return this.debugCommand;
    }
    sendExecutedCommand() {
        this.sourceMessage.next(this.commandSuccessful.toString());
    }

    verifyCommandPasser() {
        this.soloPlayer.incrementPassedTurns(this.soloOpponent.valueToEndGame, this.soloOpponent.lastTurnWasASkip);
        if (this.valueToEndGame < this.soloPlayer.maximumAllowedSkippedTurns) {
            this.endTurn();
            this.commandSuccessful = true;
            return 'Tour passé avec succès.';
        } else {
            this.finishCurrentGame();
        }
        return '';
    }

    finishCurrentGame() {
        this.link.navigate(['home']);
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

    verifyCommandEchanger(word: string) {
        const ALLOWED_NUMBER_OF_LETTERS = 7;
        if (PlayerLetterHand.allLetters.length >= ALLOWED_NUMBER_OF_LETTERS) {
            let playerHasLetters = true;
            playerHasLetters = this.verifySelectedLetters(playerHasLetters, word);
            if (playerHasLetters) {
                this.soloPlayer.exchangeLetters();
                this.endTurn();
                this.commandSuccessful = true;
                return 'Échange de lettre avec succès.';
            } else {
                this.letterService.players[0].selectedLettersForExchange.clear();
                return 'Erreur! Les lettres sélectionnées ne font pas partie de la main courante.';
            }
        } else {
            return 'Commande impossible à réaliser! La réserve ne contient pas assez de lettres.';
        }
    }

    verifySelectedLetters(playerHasLetters: boolean, word: string) {
        const letters = word.substring('!échanger '.length, word.length);
        for (let i = 0; i < letters.length; i++) {
            const letter = letters.charAt(i);
            playerHasLetters = this.letterService.selectIndex(letter) && playerHasLetters;
            if (!playerHasLetters) {
                this.letterService.buttonPressed = '';
                this.letterService.letterIsSelected = false;
                this.letterService.indexSelected = -1;
                return false;
            } else {
                this.letterService.setIndexSelected(letter);
                this.letterService.players[0].selectedLettersForExchange.add(this.letterService.indexSelected);
            }
        }
        return true;
    }
}
