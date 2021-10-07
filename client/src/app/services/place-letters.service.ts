import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';
import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { ScoreCalculatorService } from '@app/services/score-calculator.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { WordValidationService } from '@app/services/word-validation.service';
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

    // policesize
    // policesize: number = 25;

    constructor(
        private readonly gridService: GridService,
        private gameState: GameStateService,
        private readonly wordValidator: WordValidationService,
        private letterService: LetterService,
        private readonly timeManager: TimerTurnManagerService,
        private scoreCalculator: ScoreCalculatorService,
    ) {}
    verifyTileNotOutOfBound(): boolean {
        if (this.orientation === 'h' && this.colomnNumber + this.wordToPlace.length > Constants.NUMBEROFCASE) {
            return false;
        } else if (this.orientation === 'v' && this.row + this.wordToPlace.length > Constants.NUMBEROFCASE) {
            return false;
        } else {
            return true;
        }
    }
    checkInput(commandrowInput: string): string {
        const regexInput = /(?<letter>[a-o])(?<number>[0-9]|1[0-5])(?<dir>[hv])(?<space>[ ])(?<word>[a-zA-Z]{1,15})/;
        const match = regexInput.exec(commandrowInput);
        if (match != null && match.groups != null) {
            this.row = this.rowLetterToNumbers(match.groups.letter);
            this.colomnNumber = Number(match.groups.number) - 1;
            this.orientation = match.groups.dir;
            this.wordToPlace = match.groups.word;
            this.lettersToPlace = this.wordToPlace;
            this.wordContainsJoker();
            return 'ok';
        } else {
            return 'Mauvais input!';
        }
    }

    verifyAvailable(): boolean {
        let xtile: number = this.colomnNumber;
        let ytile: number = this.row;
        for (let i = 0; i <= this.wordToPlace.length - 1; i++) {
            if (!this.verifyCaseAvailable(ytile, xtile, this.wordToPlace.charAt(i))) {
                return false;
            }
            if (this.orientation === 'h') {
                xtile++;
            } else if (this.orientation === 'v') {
                ytile++;
            }
        }
        return true;
    }

    verifyCaseAvailable(i: number, j: number, letter: string): boolean {
        if (this.gameState.lettersOnBoard[i][j] === '' || this.gameState.lettersOnBoard[i][j] === letter) {
            return true;
        } else {
            return false;
        }
    }

    placeWord(commandrowInput: string): string {
        const checkInput = this.checkInput(commandrowInput);
        if (checkInput === 'ok') {
            if (!this.verifyTileNotOutOfBound()) {
                return 'Le mot dépasse du plateau de jeux.';
            } else if (!this.verifyAvailable()) {
                return 'Au moins une des cases est déjà occupée.';
            } else {
                this.placeWordGameState();
                if (this.gameState.isWordCreationPossibleWithRessources()) {
                    if (this.gameState.isBoardEmpty) {
                        if (!this.gameState.isLetterOnh8()) {
                            this.removeLetterInGameState();
                            return 'Le premier mot doit toucher à la case h8.';
                        }
                    }
                    if (this.gameState.lastLettersAdded.length === 0) {
                        this.removeLetterInGameState();
                        return 'Vous devez utiliser au moins une lettre de votre main pour créer un mot';
                    }
                    if (!this.gameState.isWordTouchingLetterOnBoard(this.wordToPlace, this.orientation)) {
                        this.removeLetterInGameState();
                        return 'Ce mot ne touche à aucune lettre déjà en jeu.';
                    }
                    this.drawWord();
                    if (this.validateWordPlaced()) {
                        this.gameState.isBoardEmpty = false;
                        this.letterService.players[this.timeManager.turn].score += this.wordValidator.pointsForLastWord;
                        return 'Mot placé avec succès.';
                    } else {
                        this.letterService.players[this.timeManager.turn].removeLettersForThreeSeconds(this.gameState.lastLettersAddedJoker);
                        return "Un mot placé n'est pas valide";
                    }
                } else {
                    this.removeLetterInGameState();
                    return "Vous n'avez pas les lettres pour écrire ce mot";
                }
            }
        } else {
            return 'Argument de commande invalide';
        }
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
            } else if (this.orientation === 'v') {
                ytile++;
            }
        }
    }

    removeLetterInGameState() {
        for (let i = 0; i < this.gameState.indexLastLetters.length; i += 2) {
            this.gameState.removeLetter(this.gameState.indexLastLetters[i], this.gameState.indexLastLetters[i + 1]);
        }
    }
    placeLetter(letter: string) {
        this.gridService.drawLetterwithpositionstring(letter, this.row, this.colomnNumber);
        // TODO isma, we need to talk about how to implement drawletter
        // this.gamestate.placeletter() ?
        if (this.orientation === 'h' && this.colomnNumber < Constants.NUMBEROFCASE) {
            this.colomnNumber = this.colomnNumber + 1;
        } else if (this.orientation === 'v' && this.row < Constants.NUMBEROFCASE) {
            this.row = this.row + 1;
        }
        this.gridService.drawarrow(this.orientation, this.row, this.colomnNumber);
        // TODO delete last arrow after word is validited
    }

    drawWord() {
        let xtile: number = this.colomnNumber;
        let ytile: number = this.row;
        this.wordValidator.pointsForLastWord = 0;
        for (let i = 0; i <= this.wordToPlace.length - 1; i++) {
            this.gridService.drawLetterwithpositionstring(this.wordToPlace.charAt(i), xtile, ytile);
            if (this.orientation === 'h') {
                xtile++;
            } else if (this.orientation === 'v') {
                ytile++;
            }
        }
    }

    validateWordPlaced() {
        if (!this.gameState.validateWordCreatedByNewLetters()) {
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
            this.letterService.players[this.timeManager.turn].removeLetters(this.gameState.lastLettersAddedJoker);
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
                    this.gridService.drawLetterwithpositionstring(this.gameState.lettersOnBoard[i][j], j, i);
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
    rawXYPositionToCasePosition(xorYPos: number): number {
        const pos = Math.floor(xorYPos / Constants.CASESIZE) - 1; // we offset by one because we want the tile A1 to be the
        // position pos[0] [0] to simplify the code.
        return pos; // only one value is returned, as the value is the same wether is this the x or y axis as the board is symetric.
    }
    caseSelected(xPos: number, yPos: number) {
        const tempColumn = this.rawXYPositionToCasePosition(yPos);
        const tempRow = this.rawXYPositionToCasePosition(xPos);
        // if(){
        if (tempRow === this.row && tempColumn === this.colomnNumber) {
            this.changeorientation();
            // todo isma discussion ici
            this.gridService.drawtilebackground(this.row, this.colomnNumber);
        } else {
            this.orientation = 'h';
            this.colomnNumber = tempColumn; // pas de -1 ici je crois
            // this.colomnNumber = tempColumn -1;
            // this.row = tempRow - 1;
            this.row = tempRow;
        }
        this.gridService.drawarrow(this.orientation, this.row, this.colomnNumber);
        // }
    }
    changeorientation() {
        if (this.orientation === 'h') {
            this.orientation = 'v';
        } else {
            this.orientation = 'h';
        }
    }
}
