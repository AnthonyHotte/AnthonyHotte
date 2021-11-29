import { TestBed, waitForAsync } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND, NUMBEROFCASE } from '@app/constants';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { DictionaryService } from './dictionary.service';
import { GameStateService } from './game-state.service';
import { PlaceLettersService } from './place-letters.service';
import { SoloOpponent2Service } from './solo-opponent2.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('SoloOpponent2Service', () => {
    let service: SoloOpponent2Service;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;
    let lettersServiceSpy: jasmine.SpyObj<LetterService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let timeManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;
    beforeEach(
        waitForAsync(() => {
            dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
            dictionaryServiceSpy.dictionaryList = [];
            dictionaryServiceSpy.dictionaryList.push(new Dictionary('t1', 'd1'));
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
            ];
            dictionaryServiceSpy.indexDictionary = 0;
            timeManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
            timeManagerServiceSpy.turn = 0;
            gameStateServiceSpy = jasmine.createSpyObj('GameStateService', [
                'placeLetter',
                'isWordCreationPossibleWithRessources',
                'isLetterOnh8',
                'isWordTouchingLetterOnBoard',
                'validateWordCreatedByNewLetters',
            ]);
            gameStateServiceSpy.lastLettersAdded = 'a';
            gameStateServiceSpy.lettersOnBoard = [];
            for (let i = 0; i < NUMBEROFCASE; i++) {
                gameStateServiceSpy.lettersOnBoard[i] = [];
                for (let j = 0; j < NUMBEROFCASE; j++) {
                    gameStateServiceSpy.lettersOnBoard[i][j] = '';
                }
            }
            letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
            letterBankServiceSpy.letterBank = [];
            for (let i = 0; i < 3; i++) {
                letterBankServiceSpy.letterBank.push({ letter: 'A', quantity: 9, point: 1 });
            }
            lettersServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
            const player1 = new PlayerLetterHand(letterBankServiceSpy);
            player1.allLettersInHand = [];
            for (let i = 0; i < MAXLETTERINHAND; i++) {
                player1.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
            }
            const player2 = new PlayerLetterHand(letterBankServiceSpy);
            player2.allLettersInHand = [];
            for (let i = 0; i < MAXLETTERINHAND; i++) {
                player2.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
            }
            lettersServiceSpy.players = [player1, player2];
            placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', [
                'placeWord',
                'removeLetterInGameState',
                'placeWordGameState',
                'verifyAvailable',
                'verifyTileNotOutOfBound',
            ]);
            TestBed.configureTestingModule({
                providers: [
                    { provide: GameStateService, useValue: gameStateServiceSpy },
                    { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
                    { provide: LetterService, useValue: lettersServiceSpy },
                    { provide: LetterBankService, useValue: letterBankServiceSpy },
                    { provide: TimerTurnManagerService, useValue: timeManagerServiceSpy },
                    { provide: DictionaryService, useValue: dictionaryServiceSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        service = TestBed.inject(SoloOpponent2Service);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should find valid word', () => {
        const dictionnary = ['allo', 'test', 'bonjour'];
        const letters = ['a', 'l', 'l', 'o'];
        const returnedvalue = service.findValidWords(dictionnary, letters);
        expect(returnedvalue[0]).toBe('allo');
    });

    it('should find valid word', () => {
        const dictionnary = ['allo', 'test', 'bonjour'];
        const letters = ['a', '*', 'l', 'o'];
        const returnedvalue = service.findValidWords(dictionnary, letters);
        expect(returnedvalue[0]).toBe('allo');
    });
    /*
    it('should find place word for first word', () => {
        gameStateServiceSpy.isBoardEmpty = true;
        service.play();
        expect(placeLettersServiceSpy.placeWord).toHaveBeenCalled();
    });*/
    it('play should call is word playable once', () => {
        gameStateServiceSpy.isBoardEmpty = false;
        const spy = spyOn(service, 'findValidWords').and.returnValue(['allo', 'la', 'le', 'ok']);
        const spy2 = spyOn(service, 'isWordPlayable').and.returnValue(Promise.resolve(true));
        gameStateServiceSpy.lettersOnBoard[0][0] = 'a';
        service.play();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
    it('play should call isWordPlayable twice', () => {
        gameStateServiceSpy.isBoardEmpty = false;
        const spy = spyOn(service, 'findValidWords').and.returnValue(['allo', 'la', 'le', 'ok']);
        const spy2 = spyOn(service, 'isWordPlayable').withArgs('allo', 0, 0, 'h').and.returnValue(Promise.resolve(false));
        spy2.withArgs('allo', 0, 0, 'v').and.returnValue(Promise.resolve(true));
        gameStateServiceSpy.lettersOnBoard[0][0] = 'a';
        service.play();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
    it("should verify word isn't valid", () => {
        const result = service.findValidWords(['allo', 'okay'], ['l', 'e']);
        expect(result.length).toEqual(0);
    });
    it('isWordPlayable should return false', async () => {
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toEqual(false);
    });
    it('isWordPlayable should return false when not available', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(false);
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(false);
    });
    it('isWordPlayable should return false when not enought ressources', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(false);
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(false);
    });
    it('isWordPlayable should return false when not on h8', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = true;
        gameStateServiceSpy.isLetterOnh8.and.returnValue(false);
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(false);
    });
    it('isWordPlayable should return true', async () => {
        const promise = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        gameStateServiceSpy.validateWordCreatedByNewLetters.and.returnValue(promise);
        gameStateServiceSpy.isBoardEmpty = true;
        gameStateServiceSpy.isLetterOnh8.and.returnValue(true);
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(true);
    });
    it('isWordPlayable should return false when las letter added lenght == 0', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = '';
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(false);
    });
    it('isWordPlayable should return false when letter not touching board', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'adr';
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(false);
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(false);
    });
    /* it('isWordPlayable should return false when word not validated', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.lastLettersAdded = 'adr';
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        gameStateServiceSpy.validateWordCreatedByNewLetters.and.returnValue(Promise.resolve(false));
        const result = service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(false);
    });*/
    it('isWordPlayable should return true when word validated', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.lastLettersAdded = 'adr';
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        // const mySpy = spyOn(gameStateServiceSpy, 'validateWordCreatedByNewLetters').and.returnValue(Promise.resolve(true));
        gameStateServiceSpy.validateWordCreatedByNewLetters.and.returnValue(Promise.resolve(true));
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(true);
    });
    it('play should return !placer undefined', async () => {
        gameStateServiceSpy.isBoardEmpty = false;
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                gameStateServiceSpy.lettersOnBoard[i][j] = '';
            }
        }
        const result = await service.play();
        expect(result).toEqual('!placer undefined');
    });
    it('play should call findValide word', async () => {
        gameStateServiceSpy.isBoardEmpty = true;
        const spy = spyOn(service, 'findValidWords').and.returnValue([]);
        await service.play();
        expect(spy).toHaveBeenCalled();
    }); /*
    it('play should when board not empty', async () => {
        gameStateServiceSpy.isBoardEmpty = false;
        const spy = spyOn(service, 'findValidWords').and.returnValue([]);
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                gameStateServiceSpy.lettersOnBoard[i][j] = 'a';
            }
        }
        await service.play();
        expect(spy).toHaveBeenCalled();
    });*/ /*
    it('play should call findValidWords with no letter on board match', async () => {
        gameStateServiceSpy.isBoardEmpty = false;
        const spy = spyOn(service, 'findValidWords').and.returnValue(['low']);
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                gameStateServiceSpy.lettersOnBoard[i][j] = 'a';
            }
        }
        await service.play();
        expect(spy).toHaveBeenCalled();
    });*/
    it('play should call is word playable', async () => {
        const promise = new Promise<string>((resolve) => {
            resolve('allo');
        });
        gameStateServiceSpy.isBoardEmpty = false;
        const spy = spyOn(service, 'findword').and.returnValue(promise);
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                gameStateServiceSpy.lettersOnBoard[i][j] = 'a';
            }
        }
        await service.play().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    });
});
