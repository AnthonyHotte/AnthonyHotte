import { PlacementValidity } from '@app/classes/placement-validity';

export class SoloOpponentUsefulFunctions {
    valid: boolean;
    constructor(valid: boolean) {
        this.valid = valid;
    }

    toChar(row: number) {
        const FOUR = 4;
        const FIVE = 5;
        const SIX = 6;
        const SEVEN = 7;
        const EIGHT = 8;
        const NINE = 9;
        const TEN = 10;
        const ELEVEN = 11;
        const TWELVE = 12;
        const THIRTEEN = 13;
        switch (row) {
            case 0:
                return 'a';
            case 1:
                return 'b';
            case 2:
                return 'c';
            case 3:
                return 'd';
            case FOUR:
                return 'e';
            case FIVE:
                return 'f';
            case SIX:
                return 'g';
            case SEVEN:
                return 'h';
            case EIGHT:
                return 'i';
            case NINE:
                return 'j';
            case TEN:
                return 'k';
            case ELEVEN:
                return 'l';
            case TWELVE:
                return 'm';
            case THIRTEEN:
                return 'n';
            default:
                return 'o';
        }
    }

    enumToString(validity: PlacementValidity) {
        switch (validity) {
            case PlacementValidity.Right:
            case PlacementValidity.Left:
                return 'h';
            case PlacementValidity.HUp:
            default:
                return 'v';
        }
    }

    checkRowsAndColumnsForWordMatch(letters: string, word: string) {
        let possibleWord = false;
        let index = -1;
        const MINUS_ONE = -1;
        for (let i = 0; i < letters.length; i++) {
            if (letters.charAt(i) === word.charAt(0)) {
                possibleWord = true;
                for (let j = 1; j < word.length; j++) {
                    if (i < letters.length) {
                        i++;
                    }
                    if (letters.charAt(i) !== word.charAt(j)) {
                        possibleWord = false;
                        j = word.length;
                    }
                    if (j === word.length - 1 && possibleWord) {
                        index = i;
                        i = letters.length;
                    }
                }
            }
        }
        possibleWord &&= index !== MINUS_ONE && index + word.length < letters.length;
        if (possibleWord) {
            possibleWord = index === 0 ? true : letters.charAt(index - 1) === ' ' && letters.charAt(index + word.length) === ' ';
        }
        return possibleWord;
    }
}
