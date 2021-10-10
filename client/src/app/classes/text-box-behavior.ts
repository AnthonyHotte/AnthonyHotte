import { Injectable } from '@angular/core';
import { MAX_CHARACTERS, MAX_NUMBER_SKIPPED_TURNS, PLACERCOMMANDLENGTH } from '@app/constants';
import { MessagePlayer } from '@app/message';
import { FinishGameService } from '@app/services/finish-game.service';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Injectable({
    providedIn: 'root',
})
export class TextBox {
    word: MessagePlayer;
    inputs: MessagePlayer[] = [];
    inputsSoloOpponent: string[];
    character: boolean = false;
    buttonMessageState: string = 'ButtonMessageActivated';
    buttonCommandState: string = 'ButtonCommandReleased';
    debugCommand: boolean = false;
    returnMessage: string;
    valueToEndGame: number;
    turn: number;

    commandSuccessful: boolean = false;
    constructor(
        private readonly placeLettersService: PlaceLettersService,
        private timeManager: TimerTurnManagerService,
        private letterService: LetterService,
        private finishGameService: FinishGameService,
        private letterBankService: LetterBankService,
    ) {
        this.word = { message: '', sender: '' };
        this.inputs = [];
        this.character = false;
        this.buttonMessageState = 'ButtonMessageActivated';
        this.buttonCommandState = 'ButtonCommandReleased';
        this.debugCommand = false;
        this.valueToEndGame = 0;
        this.turn = this.timeManager.turn;
        this.inputsSoloOpponent = [];
    }
    send(myWord: MessagePlayer) {
        this.inputVerification(myWord.message);
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
        return this.word.message;
    }

    getArray() {
        return this.inputs;
    }

    getMessagesSoloOpponent() {
        return this.inputsSoloOpponent;
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
        let text = '';
        text = 'Commande invalide.';
        if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!debug') {
            if (!this.debugCommand) {
                text = 'Affichages de débogage activés';
                this.debugCommand = true;
            } else {
                this.debugCommand = false;
                text = 'Affichages de débogage désactivés';
            }
        } else if (this.timeManager.turn === 0) {
            if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!placer') {
                text = this.placeLettersService.placeWord(myWord.substring(PLACERCOMMANDLENGTH + 1, myWord.length));
                this.endTurn('place');
                if (text !== 'Mot placé avec succès.') {
                    this.verifyCommandPasser();
                }
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!passer') {
                text = this.verifyCommandPasser();
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 2) === '!échanger') {
                text = this.verifyCommandEchanger(myWord);
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 2) === '!réserver') {
                this.activateReserver();
            } else {
                text = 'Erreur de syntaxe...';
            }
        }
        const message: MessagePlayer = { message: '', sender: 'Systeme' };
        message.message = text;
        this.inputs.push(message);
    }
    getDebugCommand() {
        return this.debugCommand;
    }

    verifyCommandPasser() {
        if (this.timeManager.turnsSkippedInARow < MAX_NUMBER_SKIPPED_TURNS) {
            this.endTurn('skip');
            return 'Tour passé avec succès.';
        } else {
            this.finishGameService.isGameFinished = true;
        }
        return '';
    }

    activateReserver() {
        return true;
    }

    endTurn(reason: string) {
        this.timeManager.endTurn(reason);
        this.commandSuccessful = true;
        if (this.letterService.players[this.timeManager.turn].allLettersInHand.length === 0) {
            this.finishGameService.isGameFinished = true;
        }
    }

    verifyCommandEchanger(word: string) {
        const ALLOWED_NUMBER_OF_LETTERS = 7;
        if (this.letterBankService.letterBank.length >= ALLOWED_NUMBER_OF_LETTERS) {
            const letters = word.substring('!échanger '.length, word.length);
            if (this.letterService.players[this.timeManager.turn].handContainLetters(letters)) {
                this.letterService.players[this.timeManager.turn].exchangeLetters(letters);
                this.endTurn('exchange');
                return 'Échange de lettre avec succès.';
            } else {
                return 'Erreur! Les lettres sélectionnées ne font pas partie de la main courante.';
            }
        } else {
            return 'Commande impossible à réaliser! La réserve ne contient pas assez de lettres.';
        }
    }

    scrollDown() {
        const mondiv = document.getElementById('DisplayZone');
        if (mondiv !== null) {
            mondiv.scrollTo(0, mondiv.scrollHeight + 1);
        }
    }
}
