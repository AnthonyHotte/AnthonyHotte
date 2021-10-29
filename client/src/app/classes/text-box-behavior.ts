import { Injectable } from '@angular/core';
import { MAX_CHARACTERS, MAX_NUMBER_SKIPPED_TURNS, PLACERCOMMANDLENGTH } from '@app/constants';
import { MessagePlayer } from '@app/message';
import { FinishGameService } from '@app/services/finish-game.service';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { Subscription } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TextBox {
    inputs: MessagePlayer[] = [];
    inputsSoloOpponent: string[];
    character: boolean = false;
    debugCommand: boolean = false;
    valueToEndGame: number;
    messageFromServer: Subscription;

    commandSuccessful: boolean = false;
    constructor(
        private readonly placeLettersService: PlaceLettersService,
        private timeManager: TimerTurnManagerService,
        private letterService: LetterService,
        private finishGameService: FinishGameService,
        private socketService: SocketService,
        private letterBankService: LetterBankService,
    ) {
        this.inputs = [];
        this.character = false;
        this.debugCommand = false;
        this.valueToEndGame = 0;
        this.inputsSoloOpponent = [];

        this.socketService.getMessageObservable().subscribe((myMessage) => {
            let text = '';
            if (myMessage.message.substring(0, PLACERCOMMANDLENGTH) === '!passer') {
                text = 'Votre adversaire a passé';
            } else if (myMessage.message.substring(0, PLACERCOMMANDLENGTH + 2) === '!échanger') {
                text = 'Votre adversaire a échangé des lettres';
            } else if (myMessage.message.substring(0, PLACERCOMMANDLENGTH + 1) === '!réserve') {
                text = 'Votre adversaire a affiché sa reserve';
            } else if (myMessage.message.substring(0, PLACERCOMMANDLENGTH) === '!placer') {
                text = this.placeLettersService.placeWord(myMessage.message.substring(PLACERCOMMANDLENGTH + 1, myMessage.message.length));
                if (text !== 'Mot placé avec succès.') {
                    this.verifyCommandPasser();
                }
            }
            const message1: MessagePlayer = { message: text, sender: 'Systeme', role: 'Systeme' };
            this.inputs.push(myMessage);
            this.inputs.push(message1);
        });
    }

    handleEnter(message: string) {
        let mess = '';
        for (let i = 0; i < message.length; ++i) {
            if (message.substr(i) === '\n') {
                const message1: MessagePlayer = { message: mess, sender: '', role: 'Systeme' };
                this.inputs.push(message1);
            } else {
                mess += message.substr(i);
            }
        }
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

    getArray() {
        return this.inputs;
    }

    getMessagesSoloOpponent() {
        return this.inputsSoloOpponent;
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
                if (text !== 'Mot placé avec succès.') {
                    this.verifyCommandPasser();
                } else {
                    this.endTurn('place');
                }
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!passer') {
                text = this.verifyCommandPasser();
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 2) === '!échanger') {
                text = this.verifyCommandEchanger(myWord);
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 1) === '!réserve') {
                this.handleEnter(this.activateReserve());
            } else {
                text = 'Erreur de syntaxe...';
            }
        }
        const message: MessagePlayer = { message: '', sender: 'Systeme', role: 'Systeme' };
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
            return '';
        }
    }

    activateReserve() {
        return this.letterBankService.getLettersInBank();
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
