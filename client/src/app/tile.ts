import { TileType, getEnumType } from './enum';

export class Tile {
    tileType: TileType;
    constructor(public positionX: number, public positionY: number, tileTypeString: string, public isEmpty: boolean, public charOnIt: string) {
        this.tileType = getEnumType(tileTypeString);
    }

    setTileType(tileTypeString: string) {
        this.tileType = getEnumType(tileTypeString);
    }
}
