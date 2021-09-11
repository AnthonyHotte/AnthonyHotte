export enum TileType {
    Normal = 'normal',
    DoubleWord = 'doubleWord',
    TripleWord = 'tripleWord',
    DoubleLetter = 'doubleLetter',
    TripleLetter = 'tripleLetter',
}

export const getEnumType = (stringType: string): TileType => {
    switch (stringType) {
        case 'doubleWord': {
            return TileType.DoubleWord;
        }
        case 'doubleLetter': {
            return TileType.DoubleLetter;
        }
        case 'tripleWord': {
            return TileType.TripleWord;
        }
        case 'tripleLetter': {
            return TileType.TripleLetter;
        }
        default: {
            return TileType.Normal;
        }
    }
};
