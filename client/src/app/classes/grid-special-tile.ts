/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Position } from '@app/position-tile-interface';

export class TileMap {
    tileMap: Map<string, Position[]>;
    constructor() {
        this.tileMap = new Map<string, Position[]>();
        this.tileMap.set('DoubleWord', [
            { positionX: 2, positionY: 2 },
            { positionX: 3, positionY: 3 },
            { positionX: 4, positionY: 4 },
            { positionX: 5, positionY: 5 },
            { positionX: 8, positionY: 8 },
            { positionX: 11, positionY: 11 },
            { positionX: 12, positionY: 12 },
            { positionX: 13, positionY: 13 },
            { positionX: 14, positionY: 14 },
            { positionX: 2, positionY: 14 },
            { positionX: 3, positionY: 13 },
            { positionX: 4, positionY: 12 },
            { positionX: 5, positionY: 11 },
            { positionX: 11, positionY: 5 },
            { positionX: 12, positionY: 4 },
            { positionX: 13, positionY: 3 },
            { positionX: 14, positionY: 2 },
        ]);
        this.tileMap.set('TripleWord', [
            { positionX: 1, positionY: 1 },
            { positionX: 1, positionY: 15 },
            { positionX: 15, positionY: 1 },
            { positionX: 15, positionY: 15 },
            { positionX: 8, positionY: 1 },
            { positionX: 1, positionY: 8 },
            { positionX: 15, positionY: 8 },
            { positionX: 8, positionY: 15 },
        ]);
        this.tileMap.set('DoubleLetter', [
            { positionX: 1, positionY: 4 },
            { positionX: 1, positionY: 12 },
            { positionX: 3, positionY: 7 },
            { positionX: 3, positionY: 9 },
            { positionX: 4, positionY: 8 },
            { positionX: 4, positionY: 1 },
            { positionX: 4, positionY: 15 },
            { positionX: 7, positionY: 3 },
            { positionX: 7, positionY: 7 },
            { positionX: 7, positionY: 9 },
            { positionX: 7, positionY: 13 },
            { positionX: 8, positionY: 4 },
            { positionX: 8, positionY: 12 },
            { positionX: 9, positionY: 3 },
            { positionX: 9, positionY: 6 },
            { positionX: 9, positionY: 8 },
            { positionX: 9, positionY: 13 },
            { positionX: 12, positionY: 1 },
            { positionX: 12, positionY: 8 },
            { positionX: 12, positionY: 15 },
            { positionX: 13, positionY: 7 },
            { positionX: 13, positionY: 9 },
            { positionX: 15, positionY: 4 },
            { positionX: 15, positionY: 12 },
        ]);
        this.tileMap.set('TripleLetter', [
            { positionX: 2, positionY: 6 },
            { positionX: 2, positionY: 10 },
            { positionX: 6, positionY: 2 },
            { positionX: 6, positionY: 6 },
            { positionX: 6, positionY: 10 },
            { positionX: 6, positionY: 14 },
            { positionX: 10, positionY: 2 },
            { positionX: 10, positionY: 6 },
            { positionX: 10, positionY: 10 },
            { positionX: 10, positionY: 14 },
            { positionX: 14, positionY: 6 },
            { positionX: 14, positionY: 10 },
        ]);
    }
    isDoubleWordTile(positionX: number, positionY: number): boolean {
        let isDoubleWord = false;
        this.tileMap.get('DoubleWord')?.forEach((pos) => {
            if (positionX === pos.positionX && positionY === pos.positionY) {
                isDoubleWord = true;
            }
        });
        return isDoubleWord;
    }
    isTripleWordTile(positionX: number, positionY: number): boolean {
        let isTripleWord = false;
        this.tileMap.get('TripleWord')?.forEach((pos) => {
            if (positionX === pos.positionX && positionY === pos.positionY) {
                isTripleWord = true;
            }
        });
        return isTripleWord;
    }
    isDoubleLetterTile(positionX: number, positionY: number): boolean {
        let isDoubleLetter = false;
        this.tileMap.get('DoubleLetter')?.forEach((pos) => {
            if (positionX === pos.positionX && positionY === pos.positionY) {
                isDoubleLetter = true;
            }
        });
        return isDoubleLetter;
    }
    isTripleLetterTile(positionX: number, positionY: number): boolean {
        let isTripleLetter = false;
        this.tileMap.get('TripleLetter')?.forEach((pos) => {
            if (positionX === pos.positionX && positionY === pos.positionY) {
                isTripleLetter = true;
            }
        });
        return isTripleLetter;
    }
}
