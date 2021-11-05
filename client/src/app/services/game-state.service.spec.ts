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
            const promise1 = new Promise<boolean>((resolve) => {
                resolve(true);
            });
            wordValidationServiceSpy.validateHorizontalWord.and.returnValue(promise1);
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
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(promise1);
        service.validateWordCreatedByNewLetters(false).then((res) => {
            expect(res).toBe(false);
        });
    });
    it('validateWordCreatedByNewLetters should return false validationHorizontalWord return false and orientationOfLastWord is v', () => {
        service.orientationOfLastWord = 'v';
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(promise1);
        service.validateWordCreatedByNewLetters(false).then((res) => {
            expect(res).toBe(false);
        });
    });

    it('validateWordCreatedByNewLetters should return false when vertical invalid word', () => {
        service.orientationOfLastWord = 'h';
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(true);
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        const promise2 = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(promise1);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(promise2);
        service.validateWordCreatedByNewLetters(false).then((res) => {
            expect(res).toBe(false);
        });
    });

    it('validateWordCreatedByNewLetters should return true when word should validate with orientation h', () => {
        service.orientationOfLastWord = 'h';
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(true);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(promise1);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(promise1);
        service.validateWordCreatedByNewLetters(false).then((res: boolean) => {
            expect(res).toBe(true);
        });
    });
    it('validateWordCreatedByNewLetters should return true when word should validate with orientation v', () => {
        service.orientationOfLastWord = 'v';
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(true);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(promise1);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(promise1);
        service.validateWordCreatedByNewLetters(false).then((res: boolean) => {
            expect(res).toBe(true);
        });
    });

    it('validateWordCreatedByNewLetters should return true when vertical is not part of vertical word', async () => {
        service.orientationOfLastWord = 'h';
        /* const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
         const promise2 = new Promise<boolean>((resolve) => {
            resolve(false);
        }); */
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(true);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(Promise.resolve(true));
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(Promise.resolve(false));
        await service.validateWordCreatedByNewLetters(false).then((res: boolean) => {
            expect(res).toBe(false);
        });
    });

    it('validateWordCreatedByNewLetters should return true when vertical is not part of horizontal word', () => {
        service.orientationOfLastWord = 'v';
        const promise2 = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        wordValidationServiceSpy.isPartOfWordVertical.and.returnValue(false);
        wordValidationServiceSpy.validateHorizontalWord.and.callThrough();
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(promise2);
        service.validateWordCreatedByNewLetters(false).then((res: boolean) => {
            expect(res).toBe(false);
        });
    });

    it('validateWordCreatedByNewLetters should return false when horizontal invalid word', () => {
        service.orientationOfLastWord = 'v';
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        const promise2 = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        wordValidationServiceSpy.isPartOfWordHorizontal.and.returnValue(true);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(promise1);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(promise2);
        service.validateWordCreatedByNewLetters(false).then((res: boolean) => {
            expect(res).toBe(false);
        });
    });

    it('validateWordCreatedByNewLetters should return true when horizontal valid word', () => {
        service.orientationOfLastWord = 'v';
        wordValidationServiceSpy.isPartOfWordHorizontal.and.returnValue(true);
        wordValidationServiceSpy.validateVerticalWord.and.returnValue(true);
        wordValidationServiceSpy.validateHorizontalWord.and.returnValue(true);
        const result = service.validateWordCreatedByNewLetters();
        expect(result).toBe(true);
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
    it('expect verify if is word touching horizontal is called if the orientation is horizontal', () => {
        service.lastLettersAdded = 'allo';
        service.isBoardEmpty = false;
        const spy = spyOn(service, 'isWordTouchingHorizontal');
        service.isWordTouchingLetterOnBoard('allo', 'h');
        expect(spy).toHaveBeenCalled();
    });

    it('horizontal word should tell word added is touching a letter on the left', () => {
        const ten = 10;
        const eleven = 11;
        const twelve = 12;
        service.indexLastLetters = [0, eleven, 0, twelve];
        service.lettersOnBoard[0][ten] = 'a';
        expect(service.isWordTouchingHorizontal()).toBe(true);
    });
    it('horizontal word should tell if word added is touching a letter on the right', () => {
        const ten = 10;
        const eleven = 11;
        const twelve = 12;
        service.indexLastLetters = [0, ten, 0, eleven];
        service.lettersOnBoard[0][twelve] = 'a';
        expect(service.isWordTouchingHorizontal()).toBe(true);
    });

    it('horizontal word should tell if word added is touching a letter under on row 1', () => {
        const ten = 10;
        const eleven = 11;
        service.indexLastLetters = [0, ten, 0, eleven];
        service.lettersOnBoard[1][ten] = 'a';
        expect(service.isWordTouchingHorizontal()).toBe(true);
    });

    it('horizontal word should tell if word added is touching a letter over on row 15', () => {
        const ten = 10;
        const eleven = 11;
        const thirteen = 13;
        const fourteen = 14;
        service.indexLastLetters = [fourteen, ten, fourteen, eleven];
        service.lettersOnBoard[thirteen][ten] = 'a';
        expect(service.isWordTouchingHorizontal()).toBe(true);
    });

    it('horizontal word should tell if word added is touching a letter over or under when word is added in the middle of the board', () => {
        const ten = 10;
        const eleven = 11;
        service.indexLastLetters = [3, ten, 3, eleven];
        service.lettersOnBoard[2][ten] = 'a';
        expect(service.isWordTouchingHorizontal()).toBe(true);
    });

    it('horizontal word should tell if word is not touching to any letter on board', () => {
        const ten = 10;
        const eleven = 11;
        service.indexLastLetters = [3, ten, 3, eleven];
        expect(service.isWordTouchingHorizontal()).toBe(false);
    });

    it('vertical word should tell if word added is touching a letter over it', () => {
        const ten = 10;
        const eleven = 11;
        const twelve = 12;
        service.indexLastLetters = [eleven, 0, twelve, 0];
        service.lettersOnBoard[ten][0] = 'a';
        expect(service.isWordTouchingVertical()).toBe(true);
    });
    it('vertical word should tell if word added is touching a letter under it', () => {
        const ten = 10;
        const eleven = 11;
        const twelve = 12;
        service.indexLastLetters = [ten, 0, eleven, 0];
        service.lettersOnBoard[twelve][0] = 'a';
        expect(service.isWordTouchingVertical()).toBe(true);
    });

    it('vertical word on column 1 should tell if word added is touching a letter on the right', () => {
        const ten = 10;
        const eleven = 11;
        service.indexLastLetters = [ten, 0, eleven, 0];
        service.lettersOnBoard[ten][1] = 'a';
        expect(service.isWordTouchingVertical()).toBe(true);
    });

    it('vertical word on column 1 should tell if word added is touching a letter on the left', () => {
        const ten = 10;
        const eleven = 11;
        const thirteen = 13;
        const fourteen = 14;
        service.indexLastLetters = [ten, fourteen, eleven, fourteen];
        service.lettersOnBoard[ten][thirteen] = 'a';
        expect(service.isWordTouchingVertical()).toBe(true);
    });

    it('vertical word should tell if word added is touching a letter on right or left when word is added in the middle of the board', () => {
        const ten = 10;
        const eleven = 11;
        service.indexLastLetters = [ten, 3, eleven, 3];
        service.lettersOnBoard[ten][2] = 'a';
        expect(service.isWordTouchingVertical()).toBe(true);
    });

    it('vertical word should tell if word is not touching to any letter on board', () => {
        const ten = 10;
        const eleven = 11;
        service.indexLastLetters = [ten, 3, eleven, 3];
        expect(service.isWordTouchingVertical()).toBe(false);
    });

    it('isWordTouchingLetterOnBoard should return true if word is not the same length as last letter added', () => {
        service.lastLettersAdded = 'llo';
        service.isBoardEmpty = true;
        expect(service.isWordTouchingLetterOnBoard('hello', 'h')).toBe(true);
    });

    it('isWordTouchingLetterOnBoard should call isWordTouchingVertical if word is not same length as last letter added and oreintation is v', () => {
        service.lastLettersAdded = 'hello';
        service.isBoardEmpty = false;
        const spy = spyOn(service, 'isWordTouchingVertical');
        service.isWordTouchingLetterOnBoard('hello', 'v');
        expect(spy).toHaveBeenCalled();
    });
});
