import { TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { ScoreCalculatorService } from './score-calculator.service';
import { SocketService } from './socket.service';

import { WordValidationService } from './word-validation.service';

fdescribe('WordValidationService', () => {
    let service: WordValidationService;
    let scoreCalculatorService: jasmine.SpyObj<ScoreCalculatorService>;
    let socketSpy: jasmine.SpyObj<SocketService>;

    beforeEach(
        waitForAsync(() => {
            scoreCalculatorService = jasmine.createSpyObj('ScoreCalculatorService', ['calculateScoreForHorizontal', 'calculateScoreForVertical']);
            socketSpy = jasmine.createSpyObj('SocketService', ['validateWord']);
            socketSpy.isWordValid = new BehaviorSubject<boolean>(false);
            TestBed.configureTestingModule({
                providers: [
                    { provide: ScoreCalculatorService, useValue: scoreCalculatorService },
                    { provide: SocketService, useValue: socketSpy },
                ],
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
    it('isPartOfWordVertical should return true with row equal 0 and letter under is not empty ', () => {
        const myBoard = [
            ['d', 'b'],
            ['u', 'a'],
        ];
        const isValid = service.isPartOfWordVertical(0, 0, myBoard);
        expect(isValid).toBe(true);
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
    it('isPartOfWordVertical should return true when place above are not empty ', () => {
        const myBoard = [
            ['a', 'd', 'y'],
            ['d', 'a', 'g'],
            ['e', 'r', 'f'],
        ];
        const isValid = service.isPartOfWordVertical(2, 1, myBoard);
        expect(isValid).toBe(true);
    });
    it('isPartOfWordHorizontale should return true when place at left are not empty and colum equal lenght-1 ', () => {
        const myBoard = [
            ['a', 'd', 'y'],
            ['d', 'a', 'g'],
            ['e', 'r', 'f'],
        ];
        const isValid = service.isPartOfWordHorizontal(1, 2, myBoard);
        expect(isValid).toBe(true);
    });
    it('isPartOfWordHorizontale should return true when place at right are not empty and colum equal 0 ', () => {
        const myBoard = [
            ['a', 'd', 'y'],
            ['d', 'a', 'g'],
            ['e', 'r', 'f'],
        ];
        const isValid = service.isPartOfWordHorizontal(1, 0, myBoard);
        expect(isValid).toBe(true);
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
        // const spyIsWordValid = spyOn(service, 'isWordValid');
        service.pointsForLastWord = 0;
        service.validateHorizontalWord(1, 2, myBoard);
        expect(scoreCalculatorService.calculateScoreForHorizontal).toHaveBeenCalledWith(0, 0, 1, '');
        expect(socketSpy.validateWord).toHaveBeenCalledWith('');
        expect(service.pointsForLastWord).toEqual(0);
    });
    it('validateHorizontalWord should create the right word ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['', '', ''],
            ['e', 'm', 'f'],
        ];
        // const spyIsWordValid = spyOn(service, 'isWordValid');
        service.validateHorizontalWord(0, 2, myBoard);
        expect(scoreCalculatorService.calculateScoreForHorizontal).toHaveBeenCalledWith(0, 2, 0, 'afy');
        expect(socketSpy.validateWord).toHaveBeenCalledWith('afy');
    });

    it('validateVerticalWord should not give point for no word ', () => {
        const myBoard = [
            ['a', '', 'y'],
            ['a', '', 'b'],
            ['e', '', 'f'],
        ];
        scoreCalculatorService.calculateScoreForVertical.and.returnValue(0);
        // const spyIsWordValid = spyOn(service, 'isWordValid');
        service.pointsForLastWord = 0;
        service.validateVerticalWord(1, 1, myBoard);
        expect(scoreCalculatorService.calculateScoreForVertical).toHaveBeenCalledWith(0, 0, 1, '');
        expect(socketSpy.validateWord).toHaveBeenCalledWith('');
        expect(service.pointsForLastWord).toEqual(0);
    });
    it('validateVerticalWord should create the right word ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['d', 'y', 'h'],
            ['e', 'm', 'f'],
        ];
        // const spyIsWordValid = spyOn(service, 'isWordValid');
        service.validateVerticalWord(0, 1, myBoard);
        expect(scoreCalculatorService.calculateScoreForVertical).toHaveBeenCalledWith(0, 2, 1, 'fym');
        expect(socketSpy.validateWord).toHaveBeenCalledWith('fym');
    });
});
