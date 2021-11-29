import { Injectable } from '@angular/core';
import { MAX_CHARACTERS, MAX_NUMBER_SKIPPED_TURNS, PLACERCOMMANDLENGTH } from '@app/constants';
import { MessagePlayer } from '@app/message';
import { FinishGameService } from '@app/services/finish-game.service';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { ObjectivesService } from '@app/services/objectives.service';
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
        private socket: SocketService,
        private objectiveService: ObjectivesService,
    ) {
        this.inputs = [];
        this.character = false;
        this.debugCommand = false;
        this.valueToEndGame = 0;
        this.inputsSoloOpponent = [];
        this.socketService.getMessageObservable().subscribe((messageString) => {
            this.handleOpponentCommand(messageString);
        });
    }

    async handleOpponentCommand(messageString: string) {
        const myMessage = { message: messageString, sender: this.letterService.players[1].name, role: 'Adversaire' };
        let text = '';
        if (myMessage.message.substring(0, PLACERCOMMANDLENGTH) === '!passer') {
            this.verifyCommandPasser();
            text = this.letterService.players[1].name + ' a passé son tour';
        } else if (myMessage.message.substring(0, PLACERCOMMANDLENGTH + 2) === '!échanger') {
            myMessage.message = '!échanger ' + myMessage.message.substring('!échanger '.length, myMessage.message.length).length.toString();
            text = this.exchangeLetterOpponent(messageString);
        } else if (myMessage.message.substring(0, PLACERCOMMANDLENGTH + 1) === '!réserve') {
            this.inputs.push(myMessage);
            text = this.letterService.players[1].name + ' a affiché la reserve';
        } else if (myMessage.message.substring(0, PLACERCOMMANDLENGTH) === '!placer') {
            text = await this.placeWordOpponent(myMessage.message, this.socket.lettersToReplace);
        } else if (myMessage.message === '!abandonner') {
            this.inputs.push(myMessage);
            text = this.letterService.players[1].name + ' a abandonné la partie';
            if (this.timeManager.turn === 1) {
                this.endTurn('skip');
            }
            if (this.letterService.players[0].name !== 'Tryphon Tournesol') {
                this.letterService.players[1].name = 'Tryphon Tournesol';
            } else {
                this.letterService.players[1].name = 'Pacôme de Champignac';
            }
            this.timeManager.gameStatus = 2;
            this.commandSuccessful = true;
        } else if (myMessage.message.substring(0, PLACERCOMMANDLENGTH + 1) === '!aide') {
            text = this.letterService.players[1].name + ' a affiché la liste de ses commandes';
        }
        this.inputs.push(myMessage);
        const messageSystem: MessagePlayer = { message: text, sender: 'Systeme', role: 'Systeme' };
        this.inputs.push(messageSystem);
    }

    async placeWordOpponent(command: string, lettersToReplace: string) {
        const text: string = await this.placeLettersService.placeWord(command.substring(PLACERCOMMANDLENGTH + 1, command.length), lettersToReplace);
        if (text !== 'Mot placé avec succès.') {
            this.verifyCommandPasser();
        } else {
            this.endTurn('place');
        }
        return text;
    }

    verifyAide(): string {
        return (
            'Voici les commandes disponibles : \n' +
            '!passer : permet de passer son tour. \n' +
            "!échanger : permet d'échanger des lettres. \n " +
            "!réserve : Permet d'afficher sa réserve. \n " +
            '!placer : permet de placer des lettres sur le plateau. \n ' +
            "!abandonner : permet d'abandonner la partie."
        );
    }

    exchangeLetterOpponent(command: string) {
        const commandResult = this.verifyCommandEchanger(command, this.socket.lettersToReplace);
        let systemResponse = '';
        if (commandResult !== 'Échange de lettre avec succès.') return systemResponse;
        systemResponse =
            this.letterService.players[1].name +
            ' a échangé ' +
            command.substring('!échanger '.length, command.length).length.toString() +
            ' lettres';
        return systemResponse;
    }

    handleEnter(message: string) {
        let mess = '';
        for (let i = 0; i < message.length; ++i) {
            if (message.charAt(i) === '\n') {
                const message1: MessagePlayer = { message: mess, sender: '', role: 'Systeme' };
                mess = '';
                this.inputs.push(message1);
            } else {
                mess += message.charAt(i);
            }
        }
        if (mess !== '') {
            const message1: MessagePlayer = { message: mess, sender: '', role: 'Systeme' };
            mess = '';
            this.inputs.push(message1);
        }
    }
    send(myWord: MessagePlayer) {
        this.inputVerification(myWord.message);
        if (this.character) return;
        // largest character on board: M -> by experience past 24 M it isn't visible so we take 23.
        const LONGEST_FRENCH_WORD_LENGTH_WITH_PADDING = 23;
        let keepGoing = true;
        let currentIndex = 0;
        // complicated way to patch the too long word problem on screen so visuals of messages are okay
        // at this point it can be called a log(n) algorithm
        while (keepGoing) {
            if (currentIndex + LONGEST_FRENCH_WORD_LENGTH_WITH_PADDING < myWord.message.length) {
                let valueOfSpace = -1;
                if ((valueOfSpace = myWord.message.substr(currentIndex, currentIndex + LONGEST_FRENCH_WORD_LENGTH_WITH_PADDING).search(' ')) < 0) {
                    currentIndex += LONGEST_FRENCH_WORD_LENGTH_WITH_PADDING;
                    const temporaryString =
                        myWord.message.substring(0, currentIndex) + ' ' + myWord.message.substring(currentIndex, myWord.message.length);
                    myWord.message = temporaryString;
                } else {
                    if (valueOfSpace === 0) {
                        currentIndex++;
                    }
                    currentIndex += valueOfSpace;
                }
            } else {
                keepGoing = false;
            }
        }
        this.inputs.push(myWord);
    }
    inputVerification(myWord: string) {
        this.character = myWord.length > MAX_CHARACTERS;
    }

    getArray() {
        return this.inputs;
    }

    getMessagesSoloOpponent() {
        return this.inputsSoloOpponent;
    }

    async isCommand(myWord: string) {
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
        } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 1) === '!aide') {
            text = '';
            this.handleEnter(this.verifyAide());
            this.socket.configureSendMessageToServer('!aide', this.timeManager.gameStatus);
        } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 1) === '!réserve') {
            text = '';
            this.handleEnter(this.activateReserve());
            this.socket.configureSendMessageToServer('!réserve', this.timeManager.gameStatus);
        } else if (myWord === '!abandonner') {
            text = '';
            this.socket.configureSendMessageToServer('!abandonner', this.timeManager.gameStatus);
            this.socketService.finishedGameMessageTransmission();
            // this.finishGameService.goToHomeAndRefresh();
        } else if (this.timeManager.turn === 0) {
            if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!placer') {
                text = await this.placeLettersService.placeWord(myWord.substring(PLACERCOMMANDLENGTH + 1, myWord.length));
                if (text !== 'Mot placé avec succès.') {
                    this.verifyCommandPasser();
                } else {
                    this.endTurn('place');
                }
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH) === '!passer') {
                text = this.verifyCommandPasser();
                this.socket.configureSendMessageToServer('!passer', this.timeManager.gameStatus);
            } else if (myWord.substring(0, PLACERCOMMANDLENGTH + 2) === '!échanger') {
                text = this.verifyCommandEchanger(myWord);
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
            this.finishGameService.updateOfEndGameValue.next(true);
            return '';
        }
    }

    activateReserve() {
        return this.letterBankService.getLettersInBank();
    }

    endTurn(reason: string) {
        if (reason === 'place') {
            this.objectiveService.consectivePlacementPlayers[this.timeManager.turn]++;
        } else {
            this.objectiveService.consectivePlacementPlayers[this.timeManager.turn] = 0;
        }
        this.timeManager.endTurn(reason);
        this.commandSuccessful = true;
        if (this.letterService.players[this.timeManager.turn].allLettersInHand.length === 0) {
            this.finishGameService.isGameFinished = true;
            this.finishGameService.updateOfEndGameValue.next(true);
        }
    }

    verifyCommandEchanger(word: string, lettersToReplace?: string) {
        const ALLOWED_NUMBER_OF_LETTERS = 7;
        if (!(this.letterBankService.letterBank.length >= ALLOWED_NUMBER_OF_LETTERS))
            return 'Commande impossible à réaliser! La réserve ne contient pas assez de lettres.';

        const letters = word.substring('!échanger '.length, word.length);
        if (!this.letterService.players[this.timeManager.turn].handContainLetters(letters))
            return 'Erreur! Les lettres sélectionnées ne font pas partie de la main courante.';

        if (lettersToReplace === undefined || this.timeManager.gameStatus === 2) {
            const lettersReplacedExchange = this.letterService.players[this.timeManager.turn].exchangeLetters(letters);
            this.socketService.sendLetterReplaced(lettersReplacedExchange, this.timeManager.gameStatus);
            this.socketService.configureSendMessageToServer('!échanger ' + letters, this.timeManager.gameStatus);
        } else {
            this.letterService.players[this.timeManager.turn].exchangeLetters(letters, lettersToReplace);
        }
        this.endTurn('exchange');
        return 'Échange de lettre avec succès.';
    }

    // TO DO : ENLEVER LA FONCTION CAR CELA FONCTIONNE SANS LE GETELEMENTBYID; C'EST UNE FONCTION INUTILE
    // scrollDown() {
        // const mondiv = document.getElementById('DisplayZone');
        // if (mondiv !== null) {
        //     mondiv.scrollTo(0, mondiv.scrollHeight + 1);
        // }
    //}
}
