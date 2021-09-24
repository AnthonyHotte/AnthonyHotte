import { Letter } from '@app/letter';

export const LETTERS: Letter[] = [
    { letter: 'A', quantity: 9, point: 1 },
    { letter: 'B', quantity: 2, point: 3 },
    { letter: 'C', quantity: 2, point: 3 },
    { letter: 'D', quantity: 3, point: 2 },
    { letter: 'E', quantity: 15, point: 1 },
    { letter: 'F', quantity: 2, point: 4 },
    { letter: 'G', quantity: 2, point: 2 },
    { letter: 'H', quantity: 2, point: 4 },
    { letter: 'I', quantity: 8, point: 1 },
    { letter: 'J', quantity: 1, point: 8 },
    { letter: 'K', quantity: 1, point: 10 },
    { letter: 'L', quantity: 5, point: 1 },
    { letter: 'M', quantity: 3, point: 2 },
    { letter: 'N', quantity: 6, point: 1 },
    { letter: 'O', quantity: 6, point: 1 },
    { letter: 'P', quantity: 2, point: 3 },
    { letter: 'Q', quantity: 1, point: 8 },
    { letter: 'R', quantity: 6, point: 1 },
    { letter: 'S', quantity: 6, point: 1 },
    { letter: 'T', quantity: 6, point: 1 },
    { letter: 'U', quantity: 6, point: 1 },
    { letter: 'V', quantity: 2, point: 4 },
    { letter: 'W', quantity: 1, point: 10 },
    { letter: 'X', quantity: 1, point: 10 },
    { letter: 'Y', quantity: 1, point: 10 },
    { letter: 'Z', quantity: 1, point: 10 },
    { letter: '*', quantity: 2, point: 0 },
];

export class LetterMap {
    letterMap: Map<string, Letter>;
    constructor() {
        this.letterMap = new Map<string, Letter>();
        this.letterMap.set('a', { letter: 'A', quantity: 9, point: 1 });
        this.letterMap.set('b', { letter: 'B', quantity: 2, point: 3 });
        this.letterMap.set('c', { letter: 'C', quantity: 2, point: 3 });
        this.letterMap.set('d', { letter: 'D', quantity: 3, point: 2 });
        this.letterMap.set('e', { letter: 'E', quantity: 15, point: 1 });
        this.letterMap.set('f', { letter: 'F', quantity: 2, point: 4 });
        this.letterMap.set('g', { letter: 'G', quantity: 2, point: 2 });
        this.letterMap.set('h', { letter: 'H', quantity: 2, point: 4 });
        this.letterMap.set('i', { letter: 'I', quantity: 8, point: 1 });
        this.letterMap.set('j', { letter: 'J', quantity: 1, point: 8 });
        this.letterMap.set('k', { letter: 'K', quantity: 1, point: 10 });
        this.letterMap.set('l', { letter: 'L', quantity: 5, point: 1 });
        this.letterMap.set('m', { letter: 'M', quantity: 3, point: 2 });
        this.letterMap.set('n', { letter: 'N', quantity: 6, point: 1 });
        this.letterMap.set('o', { letter: 'O', quantity: 6, point: 1 });
        this.letterMap.set('p', { letter: 'P', quantity: 2, point: 3 });
        this.letterMap.set('q', { letter: 'Q', quantity: 1, point: 8 });
        this.letterMap.set('r', { letter: 'R', quantity: 6, point: 1 });
        this.letterMap.set('s', { letter: 'S', quantity: 6, point: 1 });
        this.letterMap.set('t', { letter: 'T', quantity: 6, point: 1 });
        this.letterMap.set('u', { letter: 'U', quantity: 6, point: 1 });
        this.letterMap.set('v', { letter: 'V', quantity: 2, point: 4 });
        this.letterMap.set('w', { letter: 'W', quantity: 1, point: 10 });
        this.letterMap.set('x', { letter: 'X', quantity: 1, point: 10 });
        this.letterMap.set('y', { letter: 'Y', quantity: 1, point: 10 });
        this.letterMap.set('z', { letter: 'Z', quantity: 1, point: 10 });
        this.letterMap.set('*', { letter: '*', quantity: 2, point: 0 });
    }
}
