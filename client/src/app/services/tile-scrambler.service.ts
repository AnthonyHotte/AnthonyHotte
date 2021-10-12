import { Injectable } from '@angular/core';
import { TileMap } from '@app/classes/grid-special-tile';
import { Position } from '@app/position-tile-interface';
import * as constant from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class TileScramblerService {
    allBonusTiles: Position[] = [];
    newPositionDoubleWord: Position[] = [];
    newPositionTripleWord: Position[] = [];
    newPositionDoubleLetter: Position[] = [];
    newPositionTripleLetter: Position[] = [];

    scrambleTiles() {
        this.getBonusTiles();
        this.reassignNewPosition();
        this.setNewMapValues();
    }

    getBonusTiles() {
        TileMap.gridMap.tileMap.forEach((value) => {
            for (const position of value) {
                this.allBonusTiles.push(position);
            }
        });
    }

    reassignNewPosition() {
        for (let i = 0; i < constant.NUMBER_DOUBLE_WORD; i++) {
            this.newPositionDoubleWord.push(this.getRandomTile());
        }
        for (let i = 0; i < constant.NUMBER_TRIPLE_WORD; i++) {
            this.newPositionTripleWord.push(this.getRandomTile());
        }
        for (let i = 0; i < constant.NUMBER_DOUBLE_LETTER; i++) {
            this.newPositionDoubleLetter.push(this.getRandomTile());
        }
        for (let i = 0; i < constant.NUMBER_TRIPLE_LETTER; i++) {
            this.newPositionTripleLetter.push(this.getRandomTile());
        }
    }

    setNewMapValues() {
        TileMap.gridMap.tileMap.set('DoubleWord', this.newPositionDoubleWord);
        TileMap.gridMap.tileMap.set('TripleWord', this.newPositionTripleWord);
        TileMap.gridMap.tileMap.set('DoubleLetter', this.newPositionDoubleLetter);
        TileMap.gridMap.tileMap.set('TripleLetter', this.newPositionTripleLetter);
    }

    private getRandomTile(): Position {
        const index = Math.floor(Math.random() * this.allBonusTiles.length);
        const position = this.allBonusTiles[index];
        this.allBonusTiles.splice(index, 1);
        return position;
    }
}
