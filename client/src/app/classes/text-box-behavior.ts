import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { MAX_CHARACTERS, PLACERCOMMANDLENGTH } from '@app/constants';
import { MessagePlayer } from '@app/message';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlayerLetterHand } from './player-letter-hand';

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
    currentMessage: Observable<string>;
    valueToEndGame: number;
    turn: number;

    commandSuccessful: boolean = false;
    sourceMessage = new BehaviorSubject('command is successful');
    constructor(
        private readonly placeLettersService: PlaceLettersService,
        private soloPlayer: SoloPlayerService,
        private soloOpponent: SoloOpponentService,
        private timeManager: TimerTurnManagerService,
        private link: Router,
        private letterService: LetterService,
    ) {
        this.word = { message: '', sender: '', debugSate: false };
        this.inputs = [];
        this.character = false;
        this.buttonMessageState = 'ButtonMessageActivated';
        this.buttonCommandState = 'ButtonCommandReleased';
        this.debugCommand = false;
        this.currentMessage = this.sourceMessage.asObservable();
        this.sendExecutedCommand();
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
                this.endTurn();
                if (text === 'Mot placé avec succès.') {
                    this.soloOpponent.firstWordToPlay = false;
                } else {
                    this.verifyCommandPasser();
                }
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!passer') {
                text = this.verifyCommandPasser();
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 2) === '!échanger') {
                text = this.verifyCommandEchanger(myWord);
            } else {
                text = 'Erreur de syntaxe...';
            }
        }
        const message: MessagePlayer = { message: '', sender: 'Systeme', debugSate: false };
        message.message = text;
        this.inputs.push(message);
    }
    getDebugCommand() {
        return this.debugCommand;
    }
    sendExecutedCommand() {
        this.sourceMessage.next(this.commandSuccessful.toString());
        this.commandSuccessful = false;
    }

    verifyCommandPasser() {
        this.soloPlayer.incrementPassedTurns(this.soloOpponent.valueToEndGame, this.soloOpponent.lastTurnWasASkip);
        if (this.soloPlayer.valueToEndGame < this.soloPlayer.maximumAllowedSkippedTurns) {
            this.endTurn();
            return 'Tour passé avec succès.';
        } else {
            this.finishCurrentGame();
        }
        return '';
    }

    finishCurrentGame() {
        this.link.navigate(['/home']);
    }

    endTurn() {
        this.timeManager.endTurn();
        this.commandSuccessful = true;
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
            playerHasLetters = this.letterService.selectLetter(letter, 0) && playerHasLetters;
            if (!playerHasLetters) {
                this.letterService.players[0].selectedLettersForExchange.clear();
                return false;
            }
        }
        return true;
    }
    scrollDown() {
        const mondiv = document.getElementById('DisplayZone');
        if (mondiv !== null) {
            mondiv.scrollTo(0, mondiv.scrollHeight);
        }
    }
}
