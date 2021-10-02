import { TestBed, waitForAsync } from '@angular/core/testing';
import { GameStateService } from './game-state.service';
import { PlaceLettersService } from './place-letters.service';
import { SoloOpponent2Service } from './solo-opponent2.service';
import { WordValidationService } from './word-validation.service';

describe('SoloOpponent2Service', () => {
    let service: SoloOpponent2Service;
    let wordValidationServiceSpy: WordValidationService;
    let placeLettersServiceSpy: PlaceLettersService;
    let gameStateServiceSpy: GameStateService;
    // let timerTurnManagerServiceSpy: TimerTurnManager;
    // let letterServiceSpy: LetterService;

    beforeEach(
        waitForAsync(() => {
            // letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange']);
            // timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['initiateGame']);
            gameStateServiceSpy = jasmine.createSpyObj('GameStateService', [
                'placeLetter',
                'isWordCreationPossibleWithRessources',
                'isLetterOnh8',
                'isWordTouchingLetterOnBoard',
                'validateWordCreatedByNewLetters',
            ]);
            placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', [
                'checkInput',
                'verifyTileNotOutOfBound',
                'verifyAvailable',
                'placeWordGameState',
            ]);
            wordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', ['isPartOfWordVertical']);
            TestBed.configureTestingModule({
                providers: [
                    { provide: WordValidationService, useValue: wordValidationServiceSpy },
                    // { provide: LetterService, useValue: letterServiceSpy },
                    // { provide: TimerTurnManager, useValue: timerTurnManagerSpy },
                    { provide: GameStateService, useValue: gameStateServiceSpy },
                    { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SoloOpponent2Service);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should return word out Of Bounds', () => {
        const MINUS = -1;
        service.isWordPlayable('text', MINUS, MINUS, 'v');
        expect(placeLettersServiceSpy).toHaveBeenCalled();
    });

    it('should return word is not verify available', () => {
        const spy = spyOn(placeLettersServiceSpy, 'verifyAvailable').and.returnValue(false);
        service.isWordPlayable('text', 0, 0, 'h');
        expect(spy).toHaveBeenCalled();
    });

    it('should return word is playable on h8', () => {
        const SPY_1 = spyOn(placeLettersServiceSpy, 'verifyTileNotOutOfBound').and.returnValue(true);
        const SPY_2 = spyOn(placeLettersServiceSpy, 'verifyAvailable').and.returnValue(true);
        const spy = spyOn(placeLettersServiceSpy, 'placeWordGameState');
        const spyWordCreationRerssources = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = true;
        const spyGameStateLetterH8 = spyOn(gameStateServiceSpy, 'isLetterOnh8').and.returnValue(false);
        service.isWordPlayable('text', 0, 0, 'h');
        expect(SPY_1).toHaveBeenCalled();
        expect(SPY_2).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(spyWordCreationRerssources).toHaveBeenCalled();
        expect(spyGameStateLetterH8).toHaveBeenCalled();
    });

    it("should return game state didn't include any letters", () => {
        const TEST = service.isWordPlayable('word', 0, 0, 'h');
        expect(TEST).toEqual(false);
    });

    it("should return word doesn't touch any other", () => {
        const SPY_1 = spyOn(placeLettersServiceSpy, 'verifyTileNotOutOfBound').and.returnValue(true);
        const SPY_2 = spyOn(placeLettersServiceSpy, 'verifyAvailable').and.returnValue(true);
        const spy = spyOn(placeLettersServiceSpy, 'placeWordGameState');
        const spyWordCreationRerssources = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'a';
        const spyGameStateLetterH8 = spyOn(gameStateServiceSpy, 'isWordTouchingLetterOnBoard').and.returnValue(false);
        service.isWordPlayable('text', 0, 0, 'h');
        expect(SPY_1).toHaveBeenCalled();
        expect(SPY_2).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(spyWordCreationRerssources).toHaveBeenCalled();
        expect(spyGameStateLetterH8).toHaveBeenCalled();
    });

    it("should return word isn't valid", () => {
        const SPY_1 = spyOn(placeLettersServiceSpy, 'verifyTileNotOutOfBound').and.returnValue(true);
        const SPY_2 = spyOn(placeLettersServiceSpy, 'verifyAvailable').and.returnValue(true);
        const spy = spyOn(placeLettersServiceSpy, 'placeWordGameState');
        const spyWordCreationRerssources = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'a';
        const spyGameStateLetterH8 = spyOn(gameStateServiceSpy, 'isWordTouchingLetterOnBoard').and.returnValue(true);
        const spyOnSometime = spyOn(gameStateServiceSpy, 'validateWordCreatedByNewLetters');
        service.isWordPlayable('text', 0, 0, 'h');
        expect(SPY_1).toHaveBeenCalled();
        expect(SPY_2).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(spyWordCreationRerssources).toHaveBeenCalled();
        expect(spyGameStateLetterH8).toHaveBeenCalled();
        expect(spyOnSometime).toHaveBeenCalled();
    });
});
