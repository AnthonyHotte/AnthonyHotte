import { TileType } from './enum';
import { isRedCase, isDarkBlueCase, isLightBlueCase, isPinkCase } from './tile-type-usefull-function';

export class Tile {
    tileType: TileType;
    // Warning position of a Tile begins at one!
    constructor(public positionX: number, public positionY: number, public isEmpty: boolean = false, public charOnIt: string = '') {
        if (isRedCase(positionX, positionY)) {
            this.tileType = TileType.TripleWord;
        } else if (isPinkCase(positionX, positionY)) {
            this.tileType = TileType.DoubleWord;
        } else if (isDarkBlueCase(positionX, positionY)) {
            this.tileType = TileType.TripleLetter;
        } else if (isLightBlueCase(positionX, positionY)) {
            this.tileType = TileType.DoubleLetter;
        } else {
            this.tileType = TileType.Normal;
        }
    }
}
