/* eslint-disable max-lines */
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
    it('play should call is word playable once', async () => {
        gameStateServiceSpy.isBoardEmpty = false;
        const spy = spyOn(service, 'findValidWords').and.returnValue(['allo', 'la', 'le', 'ok']);
        const spy2 = spyOn(service, 'isWordPlayable').and.returnValue(Promise.resolve(true));
        gameStateServiceSpy.lettersOnBoard[0][0] = 'a';
        service.play().then(() => {
            expect(spy).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
        });
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
    it('play should call isWordPlayable twice', () => {
        gameStateServiceSpy.isBoardEmpty = false;
        service.expertmode = true;
        service.bestWordsToPlayExpert = [{ word: 'aa', score: 2, bingo: false }];
        const spy = spyOn(service, 'findValidWords').and.returnValue(['allo', 'la', 'le', 'ok']);
        const spy2 = spyOn(service, 'isWordPlayable').withArgs('allo', 0, 0, 'h').and.returnValue(Promise.resolve(false));
        spy2.withArgs('allo', 0, 0, 'v').and.returnValue(Promise.resolve(true));
        gameStateServiceSpy.lettersOnBoard[0][0] = 'a';
        service.play().then(() => {
            expect(spy).toHaveBeenCalled();
            expect(spy2).toHaveBeenCalled();
        });
    });
    it("should verify word isn't valid", () => {
        const result = service.findValidWords(['allo', 'okay'], ['l', 'e']);
        expect(result.length).toEqual(0);
    });
    it('setExpertMode set expert mode', () => {
        service.expertmode = false;
        service.setExpertMode(true);
        expect(service.expertmode).toEqual(true);
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
    it('isWordPlayable should return false when word not validated', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.lastLettersAdded = 'adr';
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        gameStateServiceSpy.validateWordCreatedByNewLetters.and.returnValue(Promise.resolve(false));
        service.isWordPlayable('allo', 1, 1, 'h').then((result) => {
            expect(result).toBe(false);
        });
    });
    it('isWordPlayable should return true when word validated', async () => {
        placeLettersServiceSpy.verifyTileNotOutOfBound.and.returnValue(true);
        placeLettersServiceSpy.verifyAvailable.and.returnValue(true);
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.lastLettersAdded = 'adr';
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        gameStateServiceSpy.validateWordCreatedByNewLetters.and.returnValue(Promise.resolve(true));
        const result = await service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(true);
    });
    it('play should return !placer undefined', async () => {
        service.expertmode = true;
        gameStateServiceSpy.isBoardEmpty = false;
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                gameStateServiceSpy.lettersOnBoard[i][j] = '';
            }
        }
        service.play().then((result) => {
            expect(result).toEqual('!placer undefined');
        });
    });
    it('play should call findValide word', async () => {
        gameStateServiceSpy.isBoardEmpty = false;
        service.expertmode = false;
        timeManagerServiceSpy.turn = 0;
        const player1 = new PlayerLetterHand(letterBankServiceSpy);
        player1.allLettersInHand = [{ letter: 'a', point: 1, quantity: 1 }];
        const player2 = new PlayerLetterHand(letterBankServiceSpy);
        lettersServiceSpy.players = [player1, player2];
        const spy = spyOn(service, 'playfirstword');
        const prob = 2;
        spyOn(service, 'calculateProbability').and.returnValue(prob);
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                gameStateServiceSpy.lettersOnBoard[i][j] = 'a';
            }
        }
        service.play().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    });
    it('play should call is word playable', async () => {
        gameStateServiceSpy.isBoardEmpty = false;
        service.expertmode = false;
        timeManagerServiceSpy.turn = 0;
        const player1 = new PlayerLetterHand(letterBankServiceSpy);
        player1.allLettersInHand = [{ letter: 'a', point: 1, quantity: 1 }];
        const player2 = new PlayerLetterHand(letterBankServiceSpy);
        lettersServiceSpy.players = [player1, player2];
        const spy = spyOn(service, 'playfirstword');
        const prob = 60;
        spyOn(service, 'calculateProbability').and.returnValue(prob);
        for (let i = 0; i < NUMBEROFCASE; i++) {
            for (let j = 0; j < NUMBEROFCASE; j++) {
                gameStateServiceSpy.lettersOnBoard[i][j] = 'a';
            }
        }
        service.play().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    });
    it('playfirstword should call pushLetterToHand', async () => {
        const promise = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        const spy = spyOn(service, 'pushLetterToHand');
        spyOn(service, 'findValidWords').and.returnValue(['aa', 'ee']);
        spyOn(service, 'isWordPlayable').and.returnValue(promise);
        spyOn(service, 'handleWordPlacingOption');
        await service.playfirstword().then(() => {
            expect(spy).toHaveBeenCalled();
        });
    });
    it('alternativePlay should return    placements alternatifs: aa ', async () => {
        service.expertmode = true;
        service.bestWordsToPlayExpert = [
            { word: 'aa', score: 2, bingo: false },
            { word: 'aa', score: 2, bingo: false },
            { word: 'aa', score: 2, bingo: false },
        ];
        const expected = 38;
        const res = service.alternativePlay();
        expect(res.length).toEqual(expected);
    });
    it('alternativePlay should return  aucune alternative', async () => {
        service.expertmode = false;
        service.alternativeplays = 'placements alternatifs: \n';
        service.bestWordsToPlayExpert = [{ word: 'aa', score: 2, bingo: false }];
        const res = service.alternativePlay();
        expect(res).toEqual("Il n'y a pas de placement alternatif");
    });
    it('alternativePlay should return  aucune    placements alternatifs: aa', async () => {
        service.expertmode = false;
        service.alternativeplays = '   placements alternatifs: aa';
        service.bestWordsToPlayExpert = [{ word: 'aa', score: 2, bingo: false }];
        const res = service.alternativePlay();
        expect(res).toEqual('   placements alternatifs: aa');
    });
    it('handleWordPlacingOption should set wordToPlaymore13to18points to admf', async () => {
        service.bestWordsToPlayExpert = [
            { word: 'aa', score: 2, bingo: false },
            { word: 'ee', score: 2, bingo: false },
            { word: 'ae', score: 2, bingo: false },
        ];
        const scoreMot = 18;
        service.wordToPlaymore13to18points = [];
        gameStateServiceSpy.playerUsedAllLetters = false;
        service.handleWordPlacingOption('admf', scoreMot);
        expect(service.wordToPlaymore13to18points[0]).toEqual({ word: 'admf', score: 18, bingo: false });
    });
    it('handleWordPlacingOption should set wordToPlay7to12points to admf', async () => {
        service.bestWordsToPlayExpert = [{ word: 'aa', score: 11, bingo: false }];
        const scoreMot = 11;
        service.wordToPlay7to12points = [];
        gameStateServiceSpy.playerUsedAllLetters = false;
        service.handleWordPlacingOption('admf', scoreMot);
        expect(service.wordToPlay7to12points[0]).toEqual({ word: 'admf', score: 11, bingo: false });
    });
    it('handleWordPlacingOption should set wordToPlayLessThan6Points to admf', async () => {
        service.bestWordsToPlayExpert = [{ word: 'aa', score: 5, bingo: false }];
        const scoreMot = 5;
        service.wordToPlayLessThan6Points = [];
        gameStateServiceSpy.playerUsedAllLetters = false;
        service.handleWordPlacingOption('admf', scoreMot);
        expect(service.wordToPlayLessThan6Points[0]).toEqual({ word: 'admf', score: 5, bingo: false });
    });
    it('fillalternativeplay should return placements non du test', () => {
        service.bestWordsToPlayExpert = [{ word: 'allo', score: 5, bingo: true }];
        const expected = 39;
        service.fillAlternativePlay(service.bestWordsToPlayExpert);
        expect(service.alternativeplays.length).toEqual(expected);
    });
});
