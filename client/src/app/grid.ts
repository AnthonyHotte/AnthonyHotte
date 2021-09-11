import { Tile } from './tile';
import { NUMBEROFCASE } from './constants';

export class Grid {
    tiles: Tile[][];
    constructor() {
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                this.tiles[i][j] = new Tile(i, j, '', true, '');
            }
        }
    }
    // do setters
}
