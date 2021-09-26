import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';
import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { WordValidationService } from '@app/services/word-validation.service';
import { LetterService } from '@app/services/letter.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
@Injectable({
    providedIn: 'root',
})
export class PlaceLettersService {
    row: number;
    colomnNumber: number;
    orientation: string;
    wordToPlace: string;
    spaceIndexInput: number;

    // policesize
    // policesize: number = 25;

    constructor(
        private readonly gridService: GridService,
        private gameState: GameStateService,
        private readonly wordValidator: WordValidationService,
        private letterService: LetterService,
        private readonly timeManager: TimerTurnManagerService,
    ) {}
    // TODO firstletter to place
    // TODO input seperated by , ?
    // TODO make sure that 2 " " back to back doesn't break the input
    // this function verify that the input is the right length so that it can be separeted by the next function
    verifyTileNotOutOfBound(): boolean {
        if (this.orientation === 'h' && this.colomnNumber + this.wordToPlace.length > Constants.NUMBEROFCASE) {
            return false;
        } else if (this.orientation === 'v' && this.row + this.wordToPlace.length > Constants.NUMBEROFCASE) {
            return false;
        } else {
            return true;
        }
    }
    checkinput(commandrowInput: string): string {
        const regexInput = /(?<letter>[a-o])(?<number>[0-9]|1[0-5])(?<dir>[hv])(?<space>[ ])(?<word>[a-zA-Z]{1,15})/;
        const match = regexInput.exec(commandrowInput);
        if (match != null && match.groups != null) {
            this.row = this.rowLetterToNumbers(match.groups.letter);
            this.colomnNumber = Number(match.groups.number) - 1;
            this.orientation = match.groups.dir;
            this.wordToPlace = match.groups.word;
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
        // const checkArgumentlength: string = this.checkArgumentInputlength(commandrowInput);
        const chekinput = this.checkinput(commandrowInput);
        if (chekinput === 'ok') {
            const tileoutofbound = this.verifyTileNotOutOfBound();
            if (tileoutofbound === false) {
                return 'le mot dépasse du plateau de jeux';
            } else if (!this.verifyAvailable()) {
                return 'Au moins une des cases est déjà occuppée';
            } else {
                this.placeWordGameState();
                if (this.gameState.isWordCreationPossibleWithRessources()) {
                    if (this.gameState.isBoardEmpty) {
                        if (!this.gameState.isLetterOnh8()) {
                            this.removeLetterInGameState();
                            return 'Le premier mot doit toucher à la case h8';
                        }
                    }
                    this.drawword();
                    if (this.validateWordPlaced()) {
                        this.gameState.isBoardEmpty = false;
                        return 'Mot placé avec succès.';
                    } else {
                        return "Un mot placé n'est pas valide";
                    }
                } else {
                    this.removeLetterInGameState();
                    return "Vous n'avez pas les lettres pour écrire ce mot";
                }
            }
            // if (can it be placed.service.chek() )//TODO add if the word exist and can be placed there
        } else {
            return 'argument de commande invalide';
        }
    }
    placeWordGameState() {
        let xtile: number = this.colomnNumber;
        let ytile: number = this.row;
        this.gameState.indexLastLetters = [];
        this.gameState.lastLettersAdded = '';
        this.gameState.orientationOfLastWord = this.orientation;
        for (let i = 0; i <= this.wordToPlace.length - 1; i++) {
            this.gameState.placeLetter(ytile, xtile, this.wordToPlace.charAt(i));
            // TODO repplace with drawletterwithposition and integrate with position
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
    drawword() {
        let xtile: number = this.colomnNumber;
        let ytile: number = this.row;
        this.wordValidator.pointsForLastWord = 0;
        for (let i = 0; i <= this.wordToPlace.length - 1; i++) {
            this.gridService.drawLetterwithpositionstring(this.wordToPlace.charAt(i), xtile, ytile);
            // TODO repplace with drawletterwithposition and integrate with position
            if (this.orientation === 'h') {
                xtile++;
            } else if (this.orientation === 'v') {
                ytile++;
            }
        }
    }

    validateWordPlaced() {
        if (!this.gameState.validateWordCreatedByNewLetters()) {
            // TODO change logic so that it doesn't need +1. +1 is needed right now for the draw grid in grid service
            // eslint-disable-next-line @typescript-eslint/no-shadow
            const delay = 3000;
            setTimeout(() => {
                for (let i = 0; i < this.gameState.indexLastLetters.length; i += 2) {
                    this.gridService.drawtilebackground(this.gameState.indexLastLetters[i + 1] + 1, this.gameState.indexLastLetters[i] + 1);
                }
                this.removeLetterInGameState();
                // console.log('sleep');
                // And any other code that should run only after 5s
            }, delay);
            this.wordValidator.pointsForLastWord = 0;
            return false;
        } else {
            for (const letter of this.gameState.lastLettersAdded) {
                this.letterService.selectLetter(letter, this.timeManager.turn);
            }
            this.letterService.players[this.timeManager.turn].exchangeLetters();
            if (this.gameState.playerUsedAllLetters) {
                this.wordValidator.pointsForLastWord += 50;
            }
            // eslint-disable-next-line no-console
            console.log(this.wordValidator.pointsForLastWord);
            return true;
        }
    }

    rowLetterToNumbers(row: string): number {
        const x: number = row.charCodeAt(0) - Constants.SIDELETTERS_TO_ASCII;
        return x;
    }
    policesizechanged() {
        const testing = this.gameState.lettersOnBoard;
        for (let i = 0; i <= Constants.NUMBEROFCASE - 1; i++) {
            for (let j = 0; j <= Constants.NUMBEROFCASE - 1; j++) {
                if (testing[i][j] !== '') {
                    this.gridService.drawLetterwithpositionstring(this.gameState.lettersOnBoard[i][j], j, i);
                }
            }
        }
    }
    /*
    placeLetter(input: string){
        const rowLetter: string = input.charAt(0).toUpperCase();
        const colomnNumber: number = Number(input.charAt(0));
        if (Constants.SIDELETTERS.includes(rowLetter) == false) {
          // TODO display error message on console
        }else if {colomnNumber != 1 || 2 || 3 || 4 || 5 || 6 || 7 || 8 || 9

        }
      row:number = this.rowLetterToNumbers(row_colomn.charAt(0));
      colomn:number =row_colomn.charAt(1);
      this.gridService.drawLetterwithposition()
      
    }
    */
}
