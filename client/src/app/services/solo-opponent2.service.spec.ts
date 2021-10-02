import { TestBed, waitForAsync } from '@angular/core/testing';
import { GameStateService } from './game-state.service';
import { PlaceLettersService } from './place-letters.service';
import { SoloOpponent2Service } from './solo-opponent2.service';

fdescribe('SoloOpponent2Service', () => {
    let service: SoloOpponent2Service;
    let placeLettersServiceSpy: PlaceLettersService;
    let gameStateServiceSpy: GameStateService;

    beforeEach(
        waitForAsync(() => {
            gameStateServiceSpy = jasmine.createSpyObj('GameStateService', [
                'placeLetter',
                'isWordCreationPossibleWithRessources',
                'isLetterOnh8',
                'isWordTouchingLetterOnBoard',
                'validateWordCreatedByNewLetters',
            ]);
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
        service.play();
        expect(returnedvalue[0]).toBe('allo');
    });
    it('should find valid word', () => {
        const dictionnary = ['allo', 'test', 'bonjour'];
        const letters = ['a', 'l', 'l', 'o'];
        const returnedvalue = service.findValidWords(dictionnary, letters);
        service.play();
        expect(returnedvalue[0]).toBe('allo');
    });

    it('should find place word for first word', () => {
        service.firstTimeToPlay = true;
        service.play();
        expect(placeLettersServiceSpy.placeWord).toHaveBeenCalled();
    });
    it("should verify word isn't valid", () => {
        const result = service.findValidWords(['allo', 'okay'], ['l', 'e']);
        expect(result.length).toEqual(0);
    });
    it('isWordPlayable should return false', () => {
        const result = service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(false);
    });
});
