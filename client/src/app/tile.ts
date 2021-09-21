import { TileType } from './enum';
import { TileMap } from '@app/classes/grid-special-tile';

export class Tile {
    tileType: TileType;
    // Warning position of a Tile begins at one!
    constructor(public positionX: number, public positionY: number, public isEmpty: boolean = false, public charOnIt: string = '') {
        if (TileMap.gridMap.isTripleWordTile(positionX, positionY)) {
            this.tileType = TileType.TripleWord;
        } else if (TileMap.gridMap.isDoubleWordTile(positionX, positionY)) {
            this.tileType = TileType.DoubleWord;
        } else if (TileMap.gridMap.isTripleLetterTile(positionX, positionY)) {
            this.tileType = TileType.TripleLetter;
        } else if (TileMap.gridMap.isDoubleLetterTile(positionX, positionY)) {
            this.tileType = TileType.DoubleLetter;
        } else {
            this.tileType = TileType.Normal;
        }
    }
}
