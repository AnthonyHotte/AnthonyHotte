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

    calculateScore(beginIndex: number, endIndex: number, constantRowOrCol: number, word: string, isHorizontal: boolean): number {
        let wordPoints = 0;
        let coefficient = 1;
        let charIndex = 0;
        for (let index = beginIndex; index <= endIndex; index++) {
            const y = isHorizontal ? index : constantRowOrCol;
            const x = isHorizontal ? constantRowOrCol : index;
            if (!this.isLetterAJoker(x, y)) {
                const tempLetter = LetterMap.letterMap.letterMap.get(word.charAt(charIndex++)) as Letter;
                if (TileMap.gridMap.isDoubleLetterTile(y + 1, x + 1) && !this.isLetterAlreadyOnBoard(x, y)) {
                    wordPoints += tempLetter.point * 2;
                } else if (TileMap.gridMap.isTripleLetterTile(y + 1, x + 1) && !this.isLetterAlreadyOnBoard(x, y)) {
                    wordPoints += tempLetter.point * 3;
                } else {
                    wordPoints += tempLetter.point;
                }
            }
            if (TileMap.gridMap.isDoubleWordTile(y + 1, x + 1) && !this.isLetterAlreadyOnBoard(x, y)) {
                coefficient *= 2;
            } else if (TileMap.gridMap.isTripleWordTile(y + 1, x + 1) && !this.isLetterAlreadyOnBoard(x, y)) {
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
