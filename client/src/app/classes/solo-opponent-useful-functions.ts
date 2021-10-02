import { PlacementValidity } from '@app/classes/placement-validity';
import { FOUR, FIVE, SIX, SEVEN, EIGHT, NINE, TEN, ELEVEN, TWELVE, THIRTEEN, FOURTEEN, NUMBEROFCASE } from '@app/constants';

export class SoloOpponentUsefulFunctions {
    valid: boolean;
    map: Map<number, string>;
    constructor(valid: boolean) {
        this.valid = valid;
        this.map = new Map<number, string>();
        this.map.set(0, 'a');
        this.map.set(1, 'b');
        this.map.set(2, 'c');
        this.map.set(3, 'd');
        this.map.set(FOUR, 'e');
        this.map.set(FIVE, 'f');
        this.map.set(SIX, 'g');
        this.map.set(SEVEN, 'h');
        this.map.set(EIGHT, 'i');
        this.map.set(NINE, 'j');
        this.map.set(TEN, 'k');
        this.map.set(ELEVEN, 'l');
        this.map.set(TWELVE, 'm');
        this.map.set(THIRTEEN, 'n');
        this.map.set(FOURTEEN, 'o');
    }

    toChar(row: number) {
        const char = this.map.get(row);
        if (char === undefined) {
            return '';
        }
        return char;
    }

    enumToString(validity: PlacementValidity) {
        switch (validity) {
            case PlacementValidity.Right:
                return 'h';
            case PlacementValidity.Left:
                return 'h';
            default:
                return 'v';
        }
    }
    // verifier que word et letter son compatible
    // letter sur le jeu col ou ligne toujours longueur 15
    // word  eau  main a   => remplace a espace  =>e u
    // match letter word
    // word n'importe
    // papa

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

    findSameColumnItems(lettersOnBoard: string[][], row: number, column: number) {
        let columnLetters = '';
        for (let i = row + 1; i < NUMBEROFCASE; i++) {
            if (lettersOnBoard[i][column] !== '') {
                columnLetters += lettersOnBoard[i][column].toLowerCase();
            }
        }
        return columnLetters;
    }
    findSameRowItems(lettersOnBoard: string[][], row: number, column: number) {
        let rowLetters = '';
        for (let i = column + 1; i < NUMBEROFCASE; i++) {
            if (lettersOnBoard[row][i] !== '') {
                rowLetters += lettersOnBoard[row][i].toLocaleLowerCase();
            }
        }
        return rowLetters;
    }
}
