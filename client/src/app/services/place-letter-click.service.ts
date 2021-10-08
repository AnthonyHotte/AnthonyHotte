import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';
import { GameStateService } from './game-state.service';
import { GridService } from './grid.service';
import { LetterService } from './letter.service';

@Injectable({
    providedIn: 'root',
})
export class PlaceLetterClickService {
    row: number;
    initialClickRow: number;
    colomnNumber: number;
    initialClickColumn: number;
    orientation: string;
    isTileSelected = false;
    wordPlacedWithClick = '';

    constructor(private gridService: GridService, private letterService: LetterService, private gameState: GameStateService) {}
    placeLetter(letter: string) {
        if (letter === 'Backspace' && this.wordPlacedWithClick.length !== 0) {
            this.removeLetterWithBackspace();
        } else if (letter === 'Enter' && this.wordPlacedWithClick.length !== 0) {
            // TODO
        } else if (!this.letterService.players[0].handContainLetters(letter) && this.gameState.lettersOnBoard[this.row][this.colomnNumber] === '') {
            // TODO this happens when the case is empty but you want to place a letter you dont have in hand
        } else if (
            this.gameState.lettersOnBoard[this.row][this.colomnNumber] !== letter &&
            this.gameState.lettersOnBoard[this.row][this.colomnNumber] !== ''
        ) {
            // TODO this happens when player wants to put a letter on a case with a different letter already on it
        } else {
            this.gridService.drawLetterwithpositionstring(letter, this.row, this.colomnNumber);
            // this.gamestate.placeletter() ?
            if (this.orientation === 'h' && this.colomnNumber < Constants.NUMBEROFCASE) {
                this.colomnNumber++;
            } else if (this.orientation === 'v' && this.row < Constants.NUMBEROFCASE) {
                this.row++;
            }
            this.wordPlacedWithClick += letter;
            this.gridService.drawarrow(this.orientation, this.row, this.colomnNumber);
            // TODO delete last arrow after word is validated
        }
    }
    caseSelected(xPos: number, yPos: number) {
        const tempColumn = this.rawXYPositionToCasePosition(yPos);
        const tempRow = this.rawXYPositionToCasePosition(xPos);
        // if(){
        if (tempRow === this.row && tempColumn === this.colomnNumber) {
            this.changeOrientation();
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
        this.isTileSelected = true;
        this.initialClickRow = this.row;
        this.initialClickColumn = this.colomnNumber;
        // }
    }
    transformIntoCommand(): string {
        let command = '!placer ';
        command += String.fromCharCode(this.initialClickRow + Constants.SIDELETTERS_TO_ASCII);
        command += (this.initialClickColumn + 1).toString();
        command += this.orientation + ' ';
        command += this.wordPlacedWithClick;
        return command;
    }

    changeOrientation() {
        this.orientation = this.orientation === 'h' ? 'v' : 'h';
    }

    rawXYPositionToCasePosition(xorYPos: number): number {
        const pos = Math.floor(xorYPos / Constants.CASESIZE) - 1; // we offset by one because we want the tile A1 to be the
        // position pos[0] [0] to simplify the code.
        return pos; // only one value is returned, as the value is the same wether is this the x or y axis as the board is symetric.
    }

    removeLetterWithBackspace() {
        return; // TODO
    }
}
