import { Injectable } from '@angular/core';
import { TileMap } from '@app/classes/grid-special-tile';
import { LetterMap } from '@app/all-letters';
import { Letter } from '@app/letter';

@Injectable({
    providedIn: 'root',
})
export class ScoreCalculatorService {
    indexLastLetters: number[] = [];
    indexJoker: number[] = [];

    calculateScoreForHorizontal(beginIndex: number, endIndex: number, row: number, word: string): number {
        let wordPoints = 0;
        let coefficient = 1;
        let charIndex = 0;
        for (let index = beginIndex; index <= endIndex; index++) {
            if (!this.isLetterAJoker(row, index)) {
                const tempLetter = LetterMap.letterMap.letterMap.get(word.charAt(charIndex++)) as Letter;
                if (TileMap.gridMap.isDoubleLetterTile(index + 1, row + 1) && !this.isLetterAlreadyOnBoard(row, index)) {
                    wordPoints += tempLetter.point * 2;
                } else if (TileMap.gridMap.isTripleLetterTile(index + 1, row + 1) && !this.isLetterAlreadyOnBoard(row, index)) {
                    wordPoints += tempLetter.point * 3;
                } else {
                    wordPoints += tempLetter.point;
                }
            }
            if (TileMap.gridMap.isDoubleWordTile(index + 1, row + 1) && !this.isLetterAlreadyOnBoard(row, index)) {
                coefficient *= 2;
            } else if (TileMap.gridMap.isTripleWordTile(index + 1, row + 1) && !this.isLetterAlreadyOnBoard(row, index)) {
                coefficient *= 3;
            }
        }
        return wordPoints * coefficient;
    }

    calculateScoreForVertical(beginIndex: number, endIndex: number, column: number, word: string): number {
        let wordPoints = 0;
        let coefficient = 1;
        let charIndex = 0;
        for (let index = beginIndex; index <= endIndex; index++) {
            if (!this.isLetterAJoker(index, column)) {
                const tempLetter = LetterMap.letterMap.letterMap.get(word.charAt(charIndex++)) as Letter;
                if (TileMap.gridMap.isDoubleLetterTile(column + 1, index + 1) && !this.isLetterAlreadyOnBoard(index, column)) {
                    wordPoints += tempLetter.point * 2;
                } else if (TileMap.gridMap.isTripleLetterTile(column + 1, index + 1) && !this.isLetterAlreadyOnBoard(index, column)) {
                    wordPoints += tempLetter.point * 3;
                } else {
                    wordPoints += tempLetter.point;
                }
            }
            if (TileMap.gridMap.isDoubleWordTile(column + 1, index + 1) && !this.isLetterAlreadyOnBoard(index, column)) {
                coefficient *= 2;
            } else if (TileMap.gridMap.isTripleWordTile(column + 1, index + 1) && !this.isLetterAlreadyOnBoard(index, column)) {
                coefficient *= 3;
            }
        }
        return wordPoints * coefficient;
    }

    isLetterAlreadyOnBoard(i: number, j: number): boolean {
        for (let m = 0; m < this.indexLastLetters.length; m += 2) {
            if (i === this.indexLastLetters[m] && j === this.indexLastLetters[m + 1]) {
                return false;
            }
        }
        return true;
    }

    isLetterAJoker(i: number, j: number): boolean {
        for (let m = 0; m < this.indexJoker.length; m += 2) {
            if (i === this.indexJoker[m] && j === this.indexJoker[m + 1]) {
                return true;
            }
        }
        return false;
    }
}
