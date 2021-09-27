import { TestBed, waitForAsync } from '@angular/core/testing';
import { ScoreCalculatorService } from './score-calculator.service';

import { WordValidationService } from './word-validation.service';

describe('WordValidationService', () => {
    let service: WordValidationService;
    let scoreCalculatorService: jasmine.SpyObj<ScoreCalculatorService>;

    beforeEach(
        waitForAsync(() => {
            scoreCalculatorService = jasmine.createSpyObj('ScoreCalculatorService', ['calculateScoreForHorizontal', 'calculateScoreForVertical']);
            TestBed.configureTestingModule({
                providers: [{ provide: ScoreCalculatorService, useValue: scoreCalculatorService }],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(WordValidationService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should have a dictionary lenght of at least one', () => {
        expect(service.dicLength).toBeGreaterThanOrEqual(1);
    });
    it('should have a word in the dictionary', () => {
        expect(service.dictionnary.length).toBeGreaterThanOrEqual(1);
    });
    it('isWordValid should return true with aa', () => {
        const isValid = service.isWordValid('aa');
        expect(isValid).toBe(true);
    });
    it('isWordLongerThanTwo should return false with a', () => {
        const isValid = service.isWordLongerThanTwo('a');
        expect(isValid).toBe(false);
    });
    it('isWordValid should return false with a', () => {
        const isValid = service.isWordValid('a');
        expect(isValid).toBe(false);
    });
    it('isWordValid should return false with abbbb', () => {
        const isValid = service.isWordValid('abbbb');
        expect(isValid).toBe(false);
    });
    it('isPartOfWordVertical should return false with row=0 and letter bellow is empty', () => {
        const myBoard = [
            ['a', 'b'],
            ['c', ''],
        ];
        const isValid = service.isPartOfWordVertical(0, 1, myBoard);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordVertical should return false with row equal the size of the array-1 and letter above is empty ', () => {
        const myBoard = [
            ['', 'b'],
            ['c', 'a'],
        ];
        const isValid = service.isPartOfWordVertical(1, 0, myBoard);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordVertical should return false when place above and bellow are empty ', () => {
        const myBoard = [
            ['a', '', 'y'],
            ['c', 'a', 'g'],
            ['e', '', 'f'],
        ];
        const isValid = service.isPartOfWordVertical(1, 1, myBoard);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordVertical should return true when the letter touch an other vertically ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['c', 'a', 'g'],
            ['e', '', 'f'],
        ];
        const isValid = service.isPartOfWordVertical(1, 1, myBoard);
        expect(isValid).toBe(true);
    });

    it('isPartOfWordHorizontal should return false with col=0 and right letter is empty', () => {
        const myBoard = [
            ['a', ''],
            ['c', 'b'],
        ];
        const isValid = service.isPartOfWordHorizontal(0, 0, myBoard);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordHorizontal should return false with col equal the size of the array-1 and letter at left is empty ', () => {
        const myBoard = [
            ['b', 'g'],
            ['', 'a'],
        ];
        const isValid = service.isPartOfWordHorizontal(1, 1, myBoard);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordHorizontal should return false when place at right and left are empty ', () => {
        const myBoard = [
            ['a', 'c', 'y'],
            ['', 'a', ''],
            ['e', 'v', 'f'],
        ];
        const isValid = service.isPartOfWordHorizontal(1, 1, myBoard);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordHorizontal should return true when the letter touch an other horizontally ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['c', 'a', ''],
            ['e', 'm', 'f'],
        ];
        const isValid = service.isPartOfWordHorizontal(1, 1, myBoard);
        expect(isValid).toBe(true);
    });

    it('validateHorizontalWord should not give point for no word ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['', '', ''],
            ['e', 'm', 'f'],
        ];
        scoreCalculatorService.calculateScoreForHorizontal.and.returnValue(0);
        const spyIsWordValid = spyOn(service, 'isWordValid');
        service.pointsForLastWord = 0;
        service.validateHorizontalWord(1, 2, myBoard);
        expect(scoreCalculatorService.calculateScoreForHorizontal).toHaveBeenCalledWith(0, 0, 1, '');
        expect(spyIsWordValid).toHaveBeenCalledWith('');
        expect(service.pointsForLastWord).toEqual(0);
    });
    it('validateHorizontalWord should create the right word ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['', '', ''],
            ['e', 'm', 'f'],
        ];
        const spyIsWordValid = spyOn(service, 'isWordValid');
        service.validateHorizontalWord(0, 2, myBoard);
        expect(scoreCalculatorService.calculateScoreForHorizontal).toHaveBeenCalledWith(0, 2, 0, 'afy');
        expect(spyIsWordValid).toHaveBeenCalledWith('afy');
    });

    it('validateVerticalWord should not give point for no word ', () => {
        const myBoard = [
            ['a', '', 'y'],
            ['a', '', 'b'],
            ['e', '', 'f'],
        ];
        scoreCalculatorService.calculateScoreForVertical.and.returnValue(0);
        const spyIsWordValid = spyOn(service, 'isWordValid');
        service.pointsForLastWord = 0;
        service.validateVerticalWord(1, 1, myBoard);
        expect(scoreCalculatorService.calculateScoreForVertical).toHaveBeenCalledWith(0, 0, 1, '');
        expect(spyIsWordValid).toHaveBeenCalledWith('');
        expect(service.pointsForLastWord).toEqual(0);
    });
    it('validateVerticalWord should create the right word ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['d', 'y', 'h'],
            ['e', 'm', 'f'],
        ];
        const spyIsWordValid = spyOn(service, 'isWordValid');
        service.validateVerticalWord(0, 1, myBoard);
        expect(scoreCalculatorService.calculateScoreForVertical).toHaveBeenCalledWith(0, 2, 1, 'fym');
        expect(spyIsWordValid).toHaveBeenCalledWith('fym');
    });
});
