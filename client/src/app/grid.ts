import { Tile } from './tile';
import { NUMBEROFCASE } from './constants';

export class Grid {
    // Warning positionX and positionY start at 1 meanwhile index in tiles starts at 0
    // Do positionX - 1 to index the Tile
    tiles: Tile[][];
    constructor() {
        for (let i = 1; i <= NUMBEROFCASE; i++) {
            for (let j = 1; j <= NUMBEROFCASE; j++) {
                this.tiles[i - 1][j - 1] = new Tile(i, j);
            }
        }
    }
}
