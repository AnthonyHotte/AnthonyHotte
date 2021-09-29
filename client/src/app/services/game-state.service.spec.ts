import { TestBed, waitForAsync } from '@angular/core/testing';
import { CENTERCASE, NUMBEROFCASE } from '@app/constants';

import { GameStateService } from '@app/services/game-state.service';
import { WordValidationService } from '@app/services/word-validation.service';

describe('GameStateService', () => {
    let service: GameStateService;
    let wordValidationServiceSpy: jasmine.SpyObj<WordValidationService>;
    beforeEach(
        waitForAsync(() => {
            wordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', [
                'isPartOfWordVertical',
                'isPartOfWordHorizontal',
                'validateHorizontalWord',
                'validateVerticalWord',
            ]);
            wordValidationServiceSpy.validateHorizontalWord.and.returnValue(true);
            TestBed.configureTestingModule({
                providers: [{ provide: WordValidationService, useValue: wordValidationServiceSpy }],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameStateService);
        service.lettersOnBoard = [];
        for (let i = 0; i < NUMBEROFCASE; i++) {
            service.lettersOnBoard[i] = [];
            for (let j = 0; j < NUMBEROFCASE; j++) {
                service.lettersOnBoard[i][j] = '';
            }
        }
        service.indexLastLetters = [0, 0, 2, 2];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('removeLetter should remove the letter a', () => {
        service.lettersOnBoard[0][0] = 'a';
        service.removeLetter(0, 0);
        expect(service.lettersOnBoard[0][0]).toMatch('');
    });
    it('placeLetter should not place the letter a when already there', () => {
        service.indexLastLetters = [];
        const spy = spyOn(service.indexLastLetters, 'push');
        service.lettersOnBoard[0][0] = 'a';
        service.placeLetter(0, 0, 'a');
        expect(service.lettersOnBoard[0][0]).toMatch('a');
        expect(spy).toHaveBeenCalledTimes(0);
    });

    it('placeLetter should place the letter', () => {
        service.indexLastLetters = [];
        service.lettersOnBoard[0][0] = '';
        service.placeLetter(0, 0, 'a');
        expect(service.lettersOnBoard[0][0]).toMatch('a');
    });

    it('placeLetter should place the joker', () => {
        service.indexLastLetters = [];
        service.lettersOnBoard[0][0] = '';
        service.placeLetter(0, 0, 'a', '*');
        expect(service.lettersOnBoard[0][0]).toMatch('a');
    });
    it('placeLetter should put playerUsedAllLetter to true when reach max letter in hand', () => {
        service.indexLastLetters = [1, 1, 2, 3, 2, 1, 1, 1, 1, 1, 1, 1];
        service.lettersOnBoard[0][0] = '';
        service.placeLetter(0, 0, 'a', '*');
        expect(service.lettersOnBoard[0][0]).toMatch('a');
        expect(service.playerUsedAllLetters).toBe(true);
    });
    it('validateWordCreatedByNewLetters should return false validationHorizontalWord return false orientationOfLastWord is h', () => {
        service.orientationOfLastWord = 'h';
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(false);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(false);
    });
    it('validateWordCreatedByNewLetters should return false validationHorizontalWord return false and orientationOfLastWord is v', () => {
        service.orientationOfLastWord = 'v';
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(false);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(false);
    });

    it('validateWordCreatedByNewLetters should return false when vertical invalid word', () => {
        service.orientationOfLastWord = 'h';
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(true);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(true);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(false);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(false);
    });

    it('validateWordCreatedByNewLetters should return true when word should validate with orientation h', () => {
        service.orientationOfLastWord = 'h';
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(true);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(true);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(true);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(true);
    });
    it('validateWordCreatedByNewLetters should return true when word should validate with orientation v', () => {
        service.orientationOfLastWord = 'v';
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(true);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(true);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(true);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(true);
    });

    it('validateWordCreatedByNewLetters should return true when vertical is not part of vertical word', () => {
        service.orientationOfLastWord = 'h';
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(false);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(true);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(false);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(true);
    });

    it('validateWordCreatedByNewLetters should return true when vertical is not part of horizontal word', () => {
        service.orientationOfLastWord = 'v';
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(false);
        wordValidationServiceSpy.validateHorizontalWord.and.callThrough();
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(false);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(false);
    });

    it('validateWordCreatedByNewLetters should return false when horizontal invalid word', () => {
        service.orientationOfLastWord = 'v';
        wordValidationServiceSpy.isPartOfWordHorizontal.and.returnValue(true);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(true);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(false);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(false);
    });
    it('isWordCreationPossibleWithRessources should return true when not part of horizontal word', () => {
        const spy = spyOn(service, 'canWordBeCreated');
        service.timeManager.turn = 0;
        service.letterService.players[0].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        service.isWordCreationPossibleWithRessources();
        expect(spy).toHaveBeenCalledWith('a');
    });
    it('canWordBeCreated should return true when the right letters are available', () => {
        service.lastLettersAddedJoker = 'allo';
        const result = service.canWordBeCreated('MALLO');
        expect(result).toBe(true);
    });
    it('canWordBeCreated should return false when the right letters are not available', () => {
        service.lastLettersAddedJoker = 'allo';
        const result = service.canWordBeCreated('MALO');
        expect(result).toBe(false);
    });
    it('isLetterOnh8 should return true when last letter is in the center', () => {
        service.indexLastLetters = [CENTERCASE - 1, CENTERCASE - 1];
        const result = service.isLetterOnh8();
        expect(result).toBe(true);
    });
    it('isLetterOnh8 should return false when last letter is not in the center', () => {
        service.indexLastLetters = [0, 0];
        const result = service.isLetterOnh8();
        expect(result).toBe(false);
    });
});
