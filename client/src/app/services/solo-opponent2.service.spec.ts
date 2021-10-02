import { TestBed, waitForAsync } from '@angular/core/testing';
import { GameStateService } from './game-state.service';
import { PlaceLettersService } from './place-letters.service';
import { SoloOpponent2Service } from './solo-opponent2.service';

describe('SoloOpponent2Service', () => {
    let service: SoloOpponent2Service;
    let placeLettersServiceSpy: PlaceLettersService;
    let gameStateServiceSpy: GameStateService;

    beforeEach(
        waitForAsync(() => {
            // letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange']);
            // timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['initiateGame']);
            service = TestBed.inject(SoloOpponent2Service);
            gameStateServiceSpy = jasmine.createSpyObj('GameStateService', ['placeLetter']);
            // placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['checkInput']);
            placeLettersServiceSpy = TestBed.inject(PlaceLettersService);
            wordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', ['isPartOfWordVertical']);
            TestBed.configureTestingModule({
                providers: [
                    { provide: WordValidationService, useValue: wordValidationServiceSpy },
                    // { provide: LetterService, useValue: letterServiceSpy },
                    // { provide: TimerTurnManager, useValue: timerTurnManagerSpy },
                    // { provide: GameStateService, useValue: gameStateServiceSpy },
                    { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});
        // service = TestBed.inject(SoloOpponent2Service);
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
        const letters = ['a', 'l', 'l', 'o'];
        const returnedvalue = service.findValidWords(dictionnary, letters);
        expect(returnedvalue[0]).toBe('allo');
    });
    it('should find place word for first word', () => {
        service.firstTimeToPlay = true;
        service.play();
        expect(spy).toHaveBeenCalled();
        // expect(returnedvalue[0]).toBe('allo');
    });
});
