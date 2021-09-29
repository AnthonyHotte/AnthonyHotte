import { TestBed } from '@angular/core/testing';
import { TileMap } from './grid-special-tile';

describe('TileMap', () => {
    let map: TileMap;

    beforeEach(() => {
        map = TestBed.inject(TileMap);
    });

    it('should create an instance', () => {
        expect(map).toBeTruthy();
    });

    it('should create an instance of the right size', () => {
        const correctMapSize = 4;
        map = new TileMap();
        expect(map.tileMap.size).toEqual(correctMapSize);
    });

    it('should create an instance with de double word array of the right size', () => {
        const correctDoubleWordSize = 17;
        expect(map.tileMap.get('DoubleWord')?.length).toEqual(correctDoubleWordSize);
    });

    it('should create an instance with the triple word array of the right size', () => {
        const correctTripleWordSize = 8;
        expect(map.tileMap.get('TripleWord')?.length).toEqual(correctTripleWordSize);
    });

    it('should create an instance with the double letter array of the right size', () => {
        const correctDoubleLetterSize = 24;
        expect(map.tileMap.get('DoubleLetter')?.length).toEqual(correctDoubleLetterSize);
    });

    it('should create an instance with the triple letter array of the right size', () => {
        const correctTripleLetterSize = 12;
        expect(map.tileMap.get('TripleLetter')?.length).toEqual(correctTripleLetterSize);
    });
    it('isDoubleWord should return true for position (2,2)', () => {
        const positionX = 2;
        const positionY = 2;
        expect(map.isDoubleWordTile(positionX, positionY)).toBe(true);
    });
    it('isDoubleWord should return false for position (2,3)', () => {
        const positionX = 2;
        const positionY = 3;
        expect(map.isDoubleWordTile(positionX, positionY)).toBe(false);
    });
    it('isTripleWord should return false for position (2,3)', () => {
        const positionX = 2;
        const positionY = 3;
        expect(map.isTripleWordTile(positionX, positionY)).toBe(false);
    });
    it('isTripleWord should return true for position (1,1)', () => {
        const positionX = 1;
        const positionY = 1;
        expect(map.isTripleWordTile(positionX, positionY)).toBe(true);
    });
    it('isTripleLetter should return false for position (1,1)', () => {
        const positionX = 1;
        const positionY = 1;
        expect(map.isTripleLetterTile(positionX, positionY)).toBe(false);
    });
    it('isTripleLetter should return true for position (2,6)', () => {
        const positionX = 14;
        const positionY = 10;
        expect(map.isTripleLetterTile(positionX, positionY)).toBe(true);
    });
    it('isDoubleLetter should return false for position (1,1)', () => {
        const positionX = 1;
        const positionY = 1;
        expect(map.isDoubleLetterTile(positionX, positionY)).toBe(false);
    });
    it('isDoubleLetter should return true for position (1,4)', () => {
        const positionX = 1;
        const positionY = 4;
        expect(map.isDoubleLetterTile(positionX, positionY)).toBe(true);
    });
    it('isDoubleLetterTile should return an error for position undefined', () => {
        const positionX = 1;
        const positionY = 4;
        const spy = spyOn(map.tileMap, 'get').and.returnValue(undefined);
        const res = map.isDoubleLetterTile(positionX, positionY);
        expect(spy).toHaveBeenCalled();
        expect(res).toBe(false);
    });
    it('isTripleLetterTile should return an error for position undefined', () => {
        const positionX = 1;
        const positionY = 4;
        const spy = spyOn(map.tileMap, 'get').and.returnValue(undefined);
        const res = map.isTripleLetterTile(positionX, positionY);
        expect(spy).toHaveBeenCalled();
        expect(res).toBe(false);
    });
    it('isTripleWorldTile should return an error for position undefined', () => {
        const positionX = 1;
        const positionY = 4;
        const spy = spyOn(map.tileMap, 'get').and.returnValue(undefined);
        const res = map.isTripleWordTile(positionX, positionY);
        expect(spy).toHaveBeenCalled();
        expect(res).toBe(false);
    });
    it('isDoubleWorldTile should return an error for position undefined', () => {
        const positionX = 1;
        const positionY = 4;
        const spy = spyOn(map.tileMap, 'get').and.returnValue(undefined);
        const res = map.isDoubleWordTile(positionX, positionY);
        expect(spy).toHaveBeenCalled();
        expect(res).toBe(false);
    });
});
