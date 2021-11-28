import { TestBed, waitForAsync } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { BehaviorSubject } from 'rxjs';
import { DictionaryService } from './dictionary.service';
import { ScoreCalculatorService } from './score-calculator.service';
import { SocketService } from './socket.service';
import { WordValidationService } from './word-validation.service';

describe('WordValidationService', () => {
    let service: WordValidationService;
    let scoreCalculatorService: jasmine.SpyObj<ScoreCalculatorService>;
    let socketSpy: jasmine.SpyObj<SocketService>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;

    beforeEach(
        waitForAsync(() => {
            dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
            dictionaryServiceSpy.indexDictionary = 0;
            dictionaryServiceSpy.dictionaryList = [];
            dictionaryServiceSpy.dictionaryList.push(new Dictionary('base', 'baseDict'));
            dictionaryServiceSpy.dictionaryList[0].words = [
                'aa',
                'aalenien',
                'aalenienne',
                'aaleniennes',
                'aaleniens',
                'aas',
                'abaca',
                'abacas',
                'abacost',
                'abacosts',
                'abacule',
                'abacules',
                'abaissa',
                'abaissable',
                'abaissables',
                'abaissai',
                'abaissaient',
                'abaissais',
                'abaissait',
                'abaissames',
                'abaissant',
                'abaissante',
                'abaissantes',
                'abaissants',
                'abaissas',
                'abaissasse',
                'abaissassent',
                'abaissasses',
                'abaissassiez',
                'abaissassions',
                'abaissat',
                'abaissates',
                'abaisse',
                'abaissee',
                'abaissees',
                'abaissement',
                'abaissements',
                'abaissent',
                'abaisser',
                'abaissera',
                'abaisserai',
                'abaisseraient',
                'abaisserais',
                'abaisserait',
                'abaisseras',
                'abaisserent',
                'abaisserez',
                'abaisseriez',
                'abaisserions',
                'abaisserons',
                'abaisseront',
                'abaisses',
                'abaisseur',
                'abaisseurs',
                'abaisseuse',
                'abaisseuses',
                'abaissez',
                'abaissiez',
            ];
            scoreCalculatorService = jasmine.createSpyObj('ScoreCalculatorService', ['calculateScore']);
            socketSpy = jasmine.createSpyObj('SocketService', ['validateWord']);
            socketSpy.isWordValid = new BehaviorSubject<boolean>(false);
            TestBed.configureTestingModule({
                providers: [
                    { provide: ScoreCalculatorService, useValue: scoreCalculatorService },
                    { provide: SocketService, useValue: socketSpy },
                    { provide: DictionaryService, useValue: dictionaryServiceSpy },
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
        expect(dictionaryServiceSpy.dictionaryList[0].words.length).toBeGreaterThanOrEqual(1);
    });
    it('should have a word in the dictionary', () => {
        expect(dictionaryServiceSpy.dictionaryList[0].words.length).toBeGreaterThanOrEqual(1);
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
        const isValid = service.isPartOfWord(0, 1, myBoard, false);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordVertical should return false with row equal the size of the array-1 and letter above is empty ', () => {
        const myBoard = [
            ['', 'b'],
            ['c', 'a'],
        ];
        const isValid = service.isPartOfWord(1, 0, myBoard, false);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordVertical should return true with row equal 0 and letter under is not empty ', () => {
        const myBoard = [
            ['d', 'b'],
            ['u', 'a'],
        ];
        const isValid = service.isPartOfWord(0, 0, myBoard, false);
        expect(isValid).toBe(true);
    });
    it('isPartOfWordVertical should return false when place above and bellow are empty ', () => {
        const myBoard = [
            ['a', '', 'y'],
            ['c', 'a', 'g'],
            ['e', '', 'f'],
        ];
        const isValid = service.isPartOfWord(1, 1, myBoard, false);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordVertical should return true when place above are not empty ', () => {
        const myBoard = [
            ['a', 'd', 'y'],
            ['d', 'a', 'g'],
            ['e', 'r', 'f'],
        ];
        const isValid = service.isPartOfWord(2, 1, myBoard, false);
        expect(isValid).toBe(true);
    });
    it('isPartOfWordHorizontale should return true when place at left are not empty and colum equal lenght-1 ', () => {
        const myBoard = [
            ['a', 'd', 'y'],
            ['d', 'a', 'g'],
            ['e', 'r', 'f'],
        ];
        const isValid = service.isPartOfWord(1, 2, myBoard, true);
        expect(isValid).toBe(true);
    });
    it('isPartOfWordHorizontale should return true when place at right are not empty and colum equal 0 ', () => {
        const myBoard = [
            ['a', 'd', 'y'],
            ['d', 'a', 'g'],
            ['e', 'r', 'f'],
        ];
        const isValid = service.isPartOfWord(1, 0, myBoard, true);
        expect(isValid).toBe(true);
    });
    it('isPartOfWordVertical should return true when the letter touch an other vertically ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['c', 'a', 'g'],
            ['e', '', 'f'],
        ];
        const isValid = service.isPartOfWord(1, 1, myBoard, true);
        expect(isValid).toBe(true);
    });

    it('isPartOfWordHorizontal should return false with col=0 and right letter is empty', () => {
        const myBoard = [
            ['a', ''],
            ['c', 'b'],
        ];
        const isValid = service.isPartOfWord(0, 0, myBoard, true);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordHorizontal should return false with col equal the size of the array-1 and letter at left is empty ', () => {
        const myBoard = [
            ['b', 'g'],
            ['', 'a'],
        ];
        const isValid = service.isPartOfWord(1, 1, myBoard, true);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordHorizontal should return false when place at right and left are empty ', () => {
        const myBoard = [
            ['a', 'c', 'y'],
            ['', 'a', ''],
            ['e', 'v', 'f'],
        ];
        const isValid = service.isPartOfWord(1, 1, myBoard, true);
        expect(isValid).toBe(false);
    });
    it('isPartOfWordHorizontal should return true when the letter touch an other horizontally ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['c', 'a', ''],
            ['e', 'm', 'f'],
        ];
        const isValid = service.isPartOfWord(1, 1, myBoard, true);
        expect(isValid).toBe(true);
    });

    it('validateHorizontalWord should not give point for no word ', async () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['', '', ''],
            ['e', 'm', 'f'],
        ];
        scoreCalculatorService.calculateScore.and.returnValue(0);
        // const spyIsWordValid = spyOn(service, 'isWordValid');
        service.pointsForLastWord = 0;
        await service.validateHorizontalWord(1, 2, myBoard, true);
        expect(scoreCalculatorService.calculateScore).toHaveBeenCalledWith(0, 0, 1, await Promise.resolve(''), true);
        expect(socketSpy.validateWord).toHaveBeenCalledWith(await Promise.resolve(''));
        expect(service.pointsForLastWord).toEqual(0);
    });
    it('validateHorizontalWord should create the right word ', async () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['', '', ''],
            ['e', 'm', 'f'],
        ];
        // const spyIsWordValid = spyOn(service, 'isWordValid');
        await service.validateHorizontalWord(0, 2, myBoard, true);
        expect(scoreCalculatorService.calculateScore).toHaveBeenCalledWith(0, 2, 0, await Promise.resolve('afy'), true);
        // expect(socketSpy.validateWord).toHaveBeenCalledWith('afy');
        expect(socketSpy.validateWord).toHaveBeenCalledWith(await Promise.resolve('afy'));
    });

    it('validateVerticalWord should not give point for no word ', async () => {
        const myBoard = [
            ['a', '', 'y'],
            ['a', '', 'b'],
            ['e', '', 'f'],
        ];
        scoreCalculatorService.calculateScore.and.returnValue(0);
        // const spyIsWordValid = spyOn(service, 'isWordValid');
        service.pointsForLastWord = 0;
        await service.validateVerticalWord(1, 1, myBoard, true);
        expect(scoreCalculatorService.calculateScore).toHaveBeenCalledWith(0, 0, 1, await Promise.resolve(''), false);
        expect(socketSpy.validateWord).toHaveBeenCalledWith(await Promise.resolve(''));
        expect(service.pointsForLastWord).toEqual(0);
    });
    it('validateVerticalWord should create the right word ', async () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['d', 'y', 'h'],
            ['e', 'm', 'f'],
        ];
        // const spyIsWordValid = spyOn(service, 'isWordValid');
        await service.validateVerticalWord(0, 1, myBoard, true);
        expect(scoreCalculatorService.calculateScore).toHaveBeenCalledWith(0, 2, 1, await Promise.resolve('fym'), false);
        expect(socketSpy.validateWord).toHaveBeenCalledWith(await Promise.resolve('fym'));
    });
    it('validateHorizontalWord should not give point for no word when solo mode ', () => {
        const myBoard = [
            ['a', 'f', 'y'],
            ['', '', ''],
            ['e', 'm', 'f'],
        ];
        const spy = spyOn(service, 'isWordValid');
        scoreCalculatorService.calculateScore.and.returnValue(0);
        service.pointsForLastWord = 0;
        service.validateHorizontalWord(1, 2, myBoard, false);
        expect(spy).toHaveBeenCalled();
        expect(service.pointsForLastWord).toEqual(0);
    });
    it('validateVerticalWord should not give point for no word when solo mode ', () => {
        const myBoard = [
            ['a', 'f', ''],
            ['', '', 'a'],
            ['e', 'm', 'a'],
        ];
        const spy = spyOn(service, 'isWordValid');
        scoreCalculatorService.calculateScore.and.returnValue(0);
        service.pointsForLastWord = 0;
        service.validateVerticalWord(1, 2, myBoard, false);
        expect(spy).toHaveBeenCalled();
        expect(service.pointsForLastWord).toEqual(0);
    });
});
