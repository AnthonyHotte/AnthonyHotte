import { Injectable } from '@angular/core';
import { LetterMap } from '@app/all-letters';
import * as Constants from '@app/constants';
import { Letter } from '@app/letter';
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
    lastKeyPressed = '';
    isLetterAtEdge = false;
    lettersFromHand = '';

    constructor(private gridService: GridService, private letterService: LetterService, private gameState: GameStateService) {}
    placeLetter(letter: string) {
        if (this.isTileSelected) {
            this.lastKeyPressed = letter;
            if (letter === 'Backspace' && this.wordPlacedWithClick.length !== 0) {
                this.removeLetterWithBackspace();
            } else if (this.letterService.players[0].handContainLetters(letter)) {
                if (!this.isLetterAtEdge) {
                    this.gridService.drawLetterwithpositionstring(letter, this.colomnNumber, this.row, 'red');
                    this.lettersFromHand += letter;
                    this.letterService.players[0].removeLettersWithoutReplacingThem(letter);
                    this.wordPlacedWithClick += letter;
                    this.handleRowAndColumnAfterLetter();
                }
                if (!this.isLetterAtEdge) {
                    this.gridService.drawarrow(this.orientation, this.row, this.colomnNumber);
                }
                // TODO delete last arrow after word is validated
            }
        }
    }
    caseSelected(xPos: number, yPos: number) {
        if (this.wordPlacedWithClick.length === 0) {
            const tempColumn = this.rawXYPositionToCasePosition(xPos);
            const tempRow = this.rawXYPositionToCasePosition(yPos);
            if (this.isTileSelected && this.gameState.lettersOnBoard[tempRow][tempColumn] === '') {
                this.removeArrowIfNeeded(this.initialClickRow, this.initialClickColumn);
            }
            if (this.gameState.lettersOnBoard[tempRow][tempColumn] === '') {
                if (tempRow === this.row && tempColumn === this.colomnNumber) {
                    this.changeOrientation();
                    // todo isma discussion ici
                    this.gridService.drawtilebackground(this.colomnNumber, this.row);
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
            }
        }
    }
    handleRowAndColumnAfterLetter() {
        this.isLetterAtEdge = false;
        do {
            if (this.orientation === 'h' && this.colomnNumber < Constants.NUMBEROFCASE) {
                this.colomnNumber++;
                if (this.colomnNumber === Constants.NUMBEROFCASE) {
                    this.isLetterAtEdge = true;
                }
            } else if (this.orientation === 'v' && this.row < Constants.NUMBEROFCASE) {
                this.row++;
                if (this.row === Constants.NUMBEROFCASE) {
                    this.isLetterAtEdge = true;
                }
            }
            if (!this.isLetterAtEdge) {
                if (this.gameState.lettersOnBoard[this.row][this.colomnNumber] !== '') {
                    this.wordPlacedWithClick += this.gameState.lettersOnBoard[this.row][this.colomnNumber];
                }
            }
        } while (!this.isLetterAtEdge && this.gameState.lettersOnBoard[this.row][this.colomnNumber] !== '');
    }

    transformIntoCommand(): string {
        let command = '!placer ';
        command += String.fromCharCode(this.initialClickRow + Constants.SIDELETTERS_TO_ASCII);
        command += (this.initialClickColumn + 1).toString();
        command += this.orientation + ' ';
        command += this.wordPlacedWithClick;
        this.reset();
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
        if (this.isLetterAtEdge && this.orientation === 'h') {
            this.colomnNumber = Constants.NUMBEROFCASE - 1;
            while (this.gameState.lettersOnBoard[this.row][this.colomnNumber] !== '') {
                this.colomnNumber--;
            }
        } else if (this.isLetterAtEdge && this.orientation === 'v') {
            this.row = Constants.NUMBEROFCASE - 1;
            while (this.gameState.lettersOnBoard[this.row][this.colomnNumber] !== '') {
                this.row--;
            }
        }
        if (!this.isLetterAtEdge) {
            this.gridService.drawtilebackground(this.colomnNumber, this.row);
            if (this.orientation === 'h' && this.colomnNumber >= 0) {
                this.colomnNumber--;
            } else if (this.orientation === 'v' && this.row >= 0) {
                this.row--;
            }
        }

        this.isLetterAtEdge = false;
        this.handleColumnAndRowAfterRemove();
        this.wordPlacedWithClick = this.wordPlacedWithClick.substr(0, this.wordPlacedWithClick.length - 1);
        const tempLetter = LetterMap.letterMap.letterMap.get(this.lettersFromHand.charAt(this.lettersFromHand.length - 1)) as Letter;
        this.letterService.players[0].allLettersInHand.push(tempLetter);
        this.lettersFromHand = this.lettersFromHand.substr(0, this.lettersFromHand.length - 1);
        this.gridService.drawtilebackground(this.colomnNumber, this.row);
        this.gridService.drawarrow(this.orientation, this.row, this.colomnNumber);
    }

    handleColumnAndRowAfterRemove() {
        while (this.gameState.lettersOnBoard[this.row][this.colomnNumber] !== '') {
            if (this.orientation === 'h' && this.colomnNumber >= 0) {
                this.colomnNumber--;
            } else if (this.orientation === 'v' && this.row >= 0) {
                this.row--;
            }
            this.wordPlacedWithClick = this.wordPlacedWithClick.substr(0, this.wordPlacedWithClick.length - 1);
        }
    }

    removeArrowIfNeeded(row: number, column: number) {
        if (this.wordPlacedWithClick.length === 0 || this.lastKeyPressed === 'Backspace') {
            this.gridService.drawtilebackground(column, row);
        }
    }

    removeWholeWord() {
        for (const letter of this.lettersFromHand) {
            if (this.lettersFromHand.length !== 0) {
                this.removeLetterWithBackspace();
                const tempLetter = LetterMap.letterMap.letterMap.get(letter) as Letter;
                this.letterService.players[0].allLettersInHand.push(tempLetter);
            }
        }
        this.removeArrowIfNeeded(this.initialClickRow, this.initialClickColumn);
    }

    reset() {
        this.removeWholeWord();
        this.isTileSelected = false;
        this.isLetterAtEdge = false;
        this.lettersFromHand = '';
        this.wordPlacedWithClick = '';
        this.row = -1;
        this.colomnNumber = -1;
        this.orientation = '';
        this.initialClickColumn = -1;
        this.initialClickRow = -1;
    }
}
