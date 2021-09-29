import { TestBed } from '@angular/core/testing';

import { ScoreCalculatorService } from './score-calculator.service';

describe('ScoreCalculatorService', () => {
    let service: ScoreCalculatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ScoreCalculatorService);
        const thirdRow = 3;
        const fourthRow = 4;
        const fifthRow = 5;
        const fourthColumn = 4;
        const sixthRow = 6;
        const seventhRow = 7;
        const eighthRow = 8;
        service.indexLastLetters = [
            0,
            0,
            1,
            0,
            0,
            1,
            fourthRow,
            0,
            fourthRow,
            1,
            fifthRow,
            1,
            fifthRow,
            2,
            fifthRow,
            3,
            fifthRow,
            fourthColumn,
            1,
            1,
            1,
            2,
            1,
            3,
            1,
            fourthColumn,
            1,
            0,
            thirdRow,
            0,
            fourthRow,
            0,
            fifthRow,
            1,
            sixthRow,
            1,
            seventhRow,
            1,
            eighthRow,
            1,
            1,
            1,
            2,
            3,
            1,
            fourthRow,
            1,
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('calculateScoreForHorizontal should be return 0 when pass {1,1,0,a}', () => {
        const result = service.calculateScoreForHorizontal(1, 1, 0, 'a');
        expect(result).toEqual(1);
    });
    it('calculateScoreForHorizontal should be return 0 when pass {0,1,4,aa}', () => {
        const expectedScore = 3;
        const rowPosition = 3;
        const firstIndex = 0;
        const secondIndex = 1;
        spyOn(service.tileMap, 'isDoubleLetterTile').and.returnValues(true);
        const result = service.calculateScoreForHorizontal(firstIndex, secondIndex, rowPosition, 'aa');
        expect(result).toEqual(expectedScore);
    });
    it('calculateScoreForHorizontal should be return 8 when pass {1,4,5,aber}', () => {
        const expectedScore = 8;
        const rowPosition = 5;
        const firstIndex = 1;
        const secondIndex = 4;
        spyOn(service.tileMap, 'isTripleLetterTile').and.returnValues(true);
        const result = service.calculateScoreForHorizontal(firstIndex, secondIndex, rowPosition, 'aber');
        expect(result).toEqual(expectedScore);
    });
    it('calculateScoreForHorizontal should be return 12 when pass {1,4,1,aber}', () => {
        const expectedScore = 12;
        const rowPosition = 1;
        const firstIndex = 1;
        const secondIndex = 4;
        spyOn(service.tileMap, 'isDoubleWordTile').and.returnValues(true);
        const result = service.calculateScoreForHorizontal(firstIndex, secondIndex, rowPosition, 'aber');
        expect(result).toEqual(expectedScore);
    });
    it('calculateScoreForHorizontal should be return 6 when pass {0,1,0,aa}', () => {
        const expectedScore = 6;
        const rowPosition = 0;
        const firstIndex = 0;
        const secondIndex = 1;
        spyOn(service.tileMap, 'isTripleWordTile').and.returnValues(true);
        const result = service.calculateScoreForHorizontal(firstIndex, secondIndex, rowPosition, 'aa');
        expect(result).toEqual(expectedScore);
    });

    it('calculateScoreForVertical should be return 0 when pass {1,1,0,a}', () => {
        const result = service.calculateScoreForVertical(1, 1, 0, 'a');
        expect(result).toEqual(1);
    });
    it('calculateScoreForVertical should be return 0 when pass {3,4,0,aa}', () => {
        const expectedScore = 3;
        const colPosition = 0;
        const firstIndex = 3;
        const secondIndex = 4;
        spyOn(service.tileMap, 'isDoubleLetterTile').and.returnValues(true);
        const result = service.calculateScoreForVertical(firstIndex, secondIndex, colPosition, 'aa');
        expect(result).toEqual(expectedScore);
    });
    it('calculateScoreForVertical should be return 8 when pass {5,8,1,aber}', () => {
        const expectedScore = 8;
        const colPosition = 1;
        const firstIndex = 5;
        const secondIndex = 8;
        spyOn(service.tileMap, 'isTripleLetterTile').and.returnValues(true);
        const result = service.calculateScoreForVertical(firstIndex, secondIndex, colPosition, 'aber');
        expect(result).toEqual(expectedScore);
    });
    it('calculateScoreForVertical should be return 12 when pass {1,4,1,aber}', () => {
        const expectedScore = 12;
        const colPosition = 1;
        const firstIndex = 1;
        const secondIndex = 4;
        spyOn(service.tileMap, 'isDoubleWordTile').and.returnValues(true);
        const result = service.calculateScoreForVertical(firstIndex, secondIndex, colPosition, 'aber');
        expect(result).toEqual(expectedScore);
    });
    it('calculateScoreForVertical should be return 6 when pass {0,1,0,aa}', () => {
        const expectedScore = 6;
        const colPosition = 0;
        const firstIndex = 0;
        const secondIndex = 1;
        spyOn(service.tileMap, 'isTripleWordTile').and.returnValues(true);
        const result = service.calculateScoreForVertical(firstIndex, secondIndex, colPosition, 'aa');
        expect(result).toEqual(expectedScore);
    });
    it("LetterAlreadyOnBoard shouldn't give bonus if on bonus tile", () => {
        const expectedScore = 3;
        const colPosition = 7;
        const firstIndex = 12;
        const secondIndex = 14;
        spyOn(service.tileMap, 'isTripleWordTile').and.returnValues(true);
        const result = service.calculateScoreForVertical(firstIndex, secondIndex, colPosition, 'nos');
        expect(result).toEqual(expectedScore);
    });
    it("Joker shouldn't give points", () => {
        const expectedScore = 3;
        const colPosition = 14;
        const firstIndex = 10;
        const secondIndex = 13;
        const indexXJoker = 14;
        const indexYJoker = 11;
        service.indexJoker = [indexYJoker, indexXJoker];
        const result = service.calculateScoreForVertical(firstIndex, secondIndex, colPosition, 'note');
        expect(result).toEqual(expectedScore);
    });
});
