import { Injectable } from '@angular/core';
import { LetterMap } from '@app/all-letters';
import * as Constants from '@app/constants';
import { Letter } from '@app/letter';
import { GameStateService } from './game-state.service';
import { GridService } from './grid.service';
import { LetterService } from './letter.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

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

    constructor(
        private gridService: GridService,
        private letterService: LetterService,
        private gameState: GameStateService,
        private timeManager: TimerTurnManagerService,
    ) {}
    placeLetter(letter: string) {
        if (!this.isTileSelected) return;
        this.lastKeyPressed = letter;
        if (letter === 'Backspace' && this.wordPlacedWithClick.length !== 0) {
            this.removeLetterWithBackspace();
        } else {
            const normalizedLetter = letter.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const regexInput = /[a-zA-Z]/;
            if (regexInput.exec(normalizedLetter) !== null && normalizedLetter.length === 1) {
                if (normalizedLetter.toLowerCase() !== normalizedLetter) {
                    if (this.letterService.players[0].handContainLetters('*')) {
                        this.addLetterOnBoard(normalizedLetter, true);
                    }
                } else {
                    if (this.letterService.players[0].handContainLetters(normalizedLetter)) {
                        this.addLetterOnBoard(normalizedLetter, false);
                    }
                }
            }
        }
    }
    addLetterOnBoard(letter: string, isLetterCaps: boolean) {
        if (!this.isLetterAtEdge) {
            this.gridService.drawLetterwithpositionstring(letter.toLowerCase(), this.colomnNumber, this.row, 'red');
            this.lettersFromHand += letter;
            if (isLetterCaps) {
                this.letterService.players[0].removeLettersWithoutReplacingThem('*');
            } else {
                this.letterService.players[0].removeLettersWithoutReplacingThem(letter);
            }

            this.wordPlacedWithClick += letter;
            this.handleRowAndColumnAfterLetter();
        }
        if (!this.isLetterAtEdge) {
            this.gridService.drawarrow(this.orientation, this.row, this.colomnNumber);
        }
    }
    caseSelected(xPos: number, yPos: number) {
        if (!(this.timeManager.turn === 0 && this.wordPlacedWithClick.length === 0)) return;
        const tempColumn = this.rawXYPositionToCasePosition(xPos);
        const tempRow = this.rawXYPositionToCasePosition(yPos);
        if (this.isTileSelected && this.gameState.lettersOnBoard[tempRow][tempColumn] === '') {
            this.removeArrowIfNeeded(this.initialClickRow, this.initialClickColumn);
        }
        if (this.gameState.lettersOnBoard[tempRow][tempColumn] === '') {
            if (tempRow === this.row && tempColumn === this.colomnNumber) {
                this.changeOrientation();
                this.gridService.drawtilebackground(this.colomnNumber, this.row);
            } else {
                this.orientation = 'h';
                this.colomnNumber = tempColumn;
                this.row = tempRow;
            }
            this.gridService.drawarrow(this.orientation, this.row, this.colomnNumber);
            this.isTileSelected = true;
            this.initialClickRow = this.row;
            this.initialClickColumn = this.colomnNumber;
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
        const lastChar = this.lettersFromHand.charAt(this.lettersFromHand.length - 1);
        let tempLetter: Letter;
        if (lastChar !== lastChar.toLowerCase()) {
            tempLetter = LetterMap.letterMap.letterMap.get('*') as Letter;
        } else {
            tempLetter = LetterMap.letterMap.letterMap.get(this.lettersFromHand.charAt(this.lettersFromHand.length - 1)) as Letter;
        }
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
        const numberOfBackspaceNecessary = this.lettersFromHand.length;
        for (let i = 0; i < numberOfBackspaceNecessary; i++) {
            if (this.lettersFromHand.length !== 0) {
                this.removeLetterWithBackspace();
            }
        }
        this.removeArrowIfNeeded(this.initialClickRow, this.initialClickColumn);
    }

    reset() {
        if (this.isTileSelected) {
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
}
