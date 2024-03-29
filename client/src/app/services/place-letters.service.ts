import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';
import { MessagePlayer } from '@app/message';
import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { ScoreCalculatorService } from '@app/services/score-calculator.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { ObjectivesService } from './objectives.service';
import { PlaceLetterClickService } from './place-letter-click.service';
import { SocketService } from './socket.service';
@Injectable({
    providedIn: 'root',
})
export class PlaceLettersService {
    row: number;
    colomnNumber: number;
    orientation: string = 'h';
    wordToPlace: string;
    lettersToPlace: string;
    spaceIndexInput: number;
    wordPlacedWithClick = '';
    wordToPlaceBrut = '';
    initialClickRow: number;
    initialClickColumn: number;
    isTileSelected = false;

    // policesize
    // policesize: number = 25;

    constructor(
        private readonly gridService: GridService,
        private gameState: GameStateService,
        private readonly wordValidator: WordValidationService,
        private letterService: LetterService,
        private readonly timeManager: TimerTurnManagerService,
        private scoreCalculator: ScoreCalculatorService,
        private placeLetterClick: PlaceLetterClickService,
        private socket: SocketService,
        private objectivesService: ObjectivesService,
    ) {}
    verifyTileNotOutOfBound(): boolean {
        if ((this.orientation === 'h' && this.colomnNumber + this.wordToPlace.length > Constants.NUMBEROFCASE) || this.colomnNumber < 0) {
            return false;
        } else if ((this.orientation === 'v' && this.row + this.wordToPlace.length > Constants.NUMBEROFCASE) || this.row < 0) {
            return false;
        } else {
            return true;
        }
    }
    checkInput(commandrowInput: string): string {
        const regexInput = /(?<letter>[a-o])(?<number>[0-9]|1[0-5])(?<dir>[hv])(?<space>[ ])(?<word>[a-zA-Z]{1,15})/;
        const match = regexInput.exec(commandrowInput);
        if (!(match != null && match.groups != null)) return 'Mauvais input!';
        this.row = this.rowLetterToNumbers(match.groups.letter);
        this.colomnNumber = Number(match.groups.number) - 1;
        this.orientation = match.groups.dir;
        this.wordToPlaceBrut = match.groups.word;
        this.wordToPlace = match.groups.word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        this.lettersToPlace = this.wordToPlace;
        this.wordContainsJoker();
        return 'ok';
    }

    verifyAvailable(): boolean {
        let xtile: number = this.colomnNumber;
        let ytile: number = this.row;
        for (let i = 0; i < this.wordToPlace.length; i++) {
            if (!this.verifyCaseAvailable(ytile, xtile, this.wordToPlace.charAt(i))) {
                return false;
            }
            if (this.orientation === 'h') {
                xtile++;
            } else {
                ytile++;
            }
        }
        return true;
    }

    verifyCaseAvailable(i: number, j: number, letter: string): boolean {
        const locallettersonBoard = this.gameState.lettersOnBoard;
        if (locallettersonBoard[i][j] === '' || locallettersonBoard[i][j] === letter) {
            return true;
        } else {
            return false;
        }
    }

    async placeWord(commandrowInput: string, lettersToReplace?: string): Promise<string> {
        const checkInput = this.checkInput(commandrowInput);
        if (checkInput === 'ok') {
            if (!this.verifyTileNotOutOfBound()) {
                this.sendWordToServer(lettersToReplace);
                return 'Le mot dépasse du plateau de jeux.';
            } else if (!this.verifyAvailable()) {
                this.sendWordToServer(lettersToReplace);
                return 'Au moins une des cases est déjà occupée.';
            } else {
                this.placeWordGameState();
                if (this.gameState.isWordCreationPossibleWithRessources()) {
                    if (this.gameState.isBoardEmpty) {
                        if (!this.gameState.isLetterOnh8()) {
                            this.removeLetterInGameState();
                            this.sendWordToServer(lettersToReplace);
                            return 'Le premier mot doit toucher à la case h8.';
                        }
                    }
                    if (this.gameState.lastLettersAdded.length === 0) {
                        this.removeLetterInGameState();
                        this.sendWordToServer(lettersToReplace);
                        return 'Vous devez utiliser au moins une lettre de votre main pour créer un mot';
                    }
                    if (!this.gameState.isWordTouchingLetterOnBoard(this.wordToPlace, this.orientation)) {
                        this.removeLetterInGameState();
                        this.sendWordToServer(lettersToReplace);
                        return 'Ce mot ne touche à aucune lettre déjà en jeu.';
                    }
                    this.drawWord();
                    // await this.socket.validateWord(this.wordToPlace);
                    const servervalidation: boolean = await this.validateWordPlaced(lettersToReplace);
                    if (servervalidation) {
                        // if (this.validateWordPlaced(lettersToReplace)) {
                        this.gameState.isBoardEmpty = false;
                        this.handleObjective();
                        this.letterService.players[this.timeManager.turn].score += this.wordValidator.pointsForLastWord;
                        this.sendWordToServer(lettersToReplace);
                        return 'Mot placé avec succès.';
                    } else {
                        this.sendWordToServer(lettersToReplace);
                        this.letterService.players[this.timeManager.turn].removeLettersForThreeSeconds(this.gameState.lastLettersAddedJoker);
                        return "Un mot placé n'est pas valide";
                    }
                } else {
                    this.removeLetterInGameState();
                    this.sendWordToServer(lettersToReplace);
                    return "Vous n'avez pas les lettres pour écrire ce mot";
                }
            }
        } else {
            this.sendWordToServer(lettersToReplace);
            return 'Argument de commande invalide';
        }
    }

    handleObjective() {
        if (!this.socket.is2990) return;
        this.objectivesService.wordsCreated = this.wordValidator.wordsCreatedLastTurn;
        this.objectivesService.indexLastLetters = this.wordValidator.indexLastLetters;
        this.objectivesService.pointsLastWord = this.wordValidator.pointsForLastWord;
        this.objectivesService.lastLettersAdded = this.gameState.lastLettersAdded;
        for (const obj of this.letterService.players[this.timeManager.turn].objectives) {
            if ((this.objectivesService.objectiveVerif.get(obj) as () => boolean).apply(this.objectivesService)) {
                if (!this.letterService.objCompleted.includes(obj)) {
                    this.letterService.players[this.timeManager.turn].score += this.objectivesService.objectivePoint.get(obj) as number;
                    this.letterService.objCompleted.push(obj);
                    this.letterService.objCompletor.push(this.timeManager.turn);
                }
            }
        }
    }
    sendWordToServer(lettersToReplace?: string) {
        if (lettersToReplace !== undefined) return;
        const row = String.fromCharCode(this.row + Constants.SIDELETTERS_TO_ASCII);
        const command = '!placer ' + row + (this.colomnNumber + 1).toString() + this.orientation + ' ' + this.wordToPlaceBrut;
        this.socket.configureSendMessageToServer(command, this.timeManager.gameStatus);
    }
    placeWordGameState() {
        let xtile: number = this.colomnNumber;
        let ytile: number = this.row;
        this.gameState.indexLastLetters = [];
        this.gameState.lastLettersAdded = '';
        this.gameState.lastLettersAddedJoker = '';
        this.scoreCalculator.indexJoker = [];
        this.gameState.orientationOfLastWord = this.orientation;
        for (let i = 0; i <= this.wordToPlace.length - 1; i++) {
            this.gameState.placeLetter(ytile, xtile, this.wordToPlace.charAt(i), this.lettersToPlace.charAt(i));
            if (this.orientation === 'h') {
                xtile++;
            } else {
                ytile++;
            }
        }
    }

    removeLetterInGameState() {
        for (let i = 0; i < this.gameState.indexLastLetters.length; i += 2) {
            this.gameState.removeLetter(this.gameState.indexLastLetters[i], this.gameState.indexLastLetters[i + 1]);
        }
    }

    drawWord() {
        let xtile: number = this.colomnNumber;
        let ytile: number = this.row;
        this.wordValidator.pointsForLastWord = 0;
        for (let i = 0; i <= this.wordToPlace.length - 1; i++) {
            this.gridService.drawLetterwithpositionstring(this.wordToPlace.charAt(i), xtile, ytile, 'black');
            if (this.orientation === 'h') {
                xtile++;
            } else {
                ytile++;
            }
        }
    }

    async validateWordPlaced(lettersToReplace?: string) {
        if (!(await this.gameState.validateWordCreatedByNewLetters(true))) {
            const delay = 3000;
            setTimeout(() => {
                for (let i = 0; i < this.gameState.indexLastLetters.length; i += 2) {
                    this.gridService.drawtilebackground(this.gameState.indexLastLetters[i + 1], this.gameState.indexLastLetters[i]);
                }
                this.removeLetterInGameState();
            }, delay);
            this.wordValidator.pointsForLastWord = 0;
            return false;
        } else {
            if (lettersToReplace === undefined) {
                this.letterService.players[this.timeManager.turn].removeLetters(this.gameState.lastLettersAddedJoker);
                this.socket.sendLetterReplaced(this.letterService.players[this.timeManager.turn].lettersReplaced, this.timeManager.gameStatus);
            } else {
                this.letterService.players[this.timeManager.turn].removeLetters(this.gameState.lastLettersAddedJoker, lettersToReplace);
            }
            if (this.gameState.playerUsedAllLetters) {
                this.wordValidator.pointsForLastWord += 50;
            }
            return true;
        }
    }

    rowLetterToNumbers(row: string): number {
        const x: number = row.charCodeAt(0) - Constants.SIDELETTERS_TO_ASCII;
        return x;
    }
    policeSizeChanged() {
        const testing = this.gameState.lettersOnBoard;
        for (let i = 0; i <= Constants.NUMBEROFCASE - 1; i++) {
            for (let j = 0; j <= Constants.NUMBEROFCASE - 1; j++) {
                if (testing[i][j] !== '') {
                    this.gridService.drawLetterwithpositionstring(this.gameState.lettersOnBoard[i][j], j, i, 'black');
                }
            }
        }
    }

    wordContainsJoker() {
        let positionOfJoker = 0;
        for (const letter of this.wordToPlace) {
            if (letter === letter.toUpperCase()) {
                this.wordToPlace = this.removeUpperCaseFromString(positionOfJoker);
            }
            positionOfJoker++;
        }
    }

    removeUpperCaseFromString(index: number): string {
        const tempWord = this.wordToPlace.split('');
        const tempLetters = [...tempWord];
        tempWord[index] = tempWord[index].toLowerCase();
        tempLetters[index] = '*';
        this.lettersToPlace = tempLetters.join('');
        return tempWord.join(''); // reconstruct the string
    }

    submitWordMadeClick(): MessagePlayer {
        const myMessage: MessagePlayer = { message: '', sender: this.letterService.players[0].name, role: 'Joueur' };
        myMessage.message = this.placeLetterClick.transformIntoCommand();
        return myMessage;
    }
}
