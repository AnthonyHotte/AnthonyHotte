import { Injectable } from '@angular/core';
import { TileMap } from '@app/classes/grid-special-tile';
import { LetterMap } from '@app/all-letters';
import { Letter } from '@app/letter';

@Injectable({
    providedIn: 'root',
})
export class ScoreCalculatorService {
    letters = new LetterMap();
    constructor(readonly tileMap: TileMap) {}

    calculateScoreForHorizontal(beginIndex: number, endIndex: number, row: number, word: string): number {
        let wordPoints = 0;
        let coefficient = 1;
        let charIndex = 0;
        for (let index = beginIndex; index <= endIndex; index++) {
            const tempLetter = this.letters.letterMap.get(word.charAt(charIndex++)) as Letter;
            if (this.tileMap.isDoubleLetterTile(index + 1, row + 1)) {
                wordPoints += tempLetter.point * 2;
            } else if (this.tileMap.isTripleLetterTile(index + 1, row + 1)) {
                wordPoints += tempLetter.point * 3;
            } else {
                wordPoints += tempLetter.point;
            }
            if (this.tileMap.isDoubleWordTile(index + 1, row + 1)) {
                coefficient *= 2;
            } else if (this.tileMap.isTripleWordTile(index + 1, row + 1)) {
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
            const tempLetter = this.letters.letterMap.get(word.charAt(charIndex++)) as Letter;
            if (this.tileMap.isDoubleLetterTile(column + 1, index + 1)) {
                wordPoints += tempLetter.point * 2;
            } else if (this.tileMap.isTripleLetterTile(column + 1, index + 1)) {
                wordPoints += tempLetter.point * 3;
            } else {
                wordPoints += tempLetter.point;
            }
            if (this.tileMap.isDoubleWordTile(column + 1, index + 1)) {
                coefficient *= 2;
            } else if (this.tileMap.isTripleWordTile(column + 1, index + 1)) {
                coefficient *= 3;
            }
        }
        return wordPoints * coefficient;
    }
}
