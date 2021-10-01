import { TestBed, waitForAsync } from '@angular/core/testing';
// import { GameStateService } from './game-state.service';
// import { PlaceLettersService } from './place-letters.service';
import { SoloOpponent2Service } from './solo-opponent2.service';
import { WordValidationService } from './word-validation.service';

describe('SoloOpponent2Service', () => {
    let service: SoloOpponent2Service;
    let wordValidationServiceSpy: WordValidationService;
    // let placeLettersServiceSpy: PlaceLettersService;
    // let gameStateServiceSpy: GameStateService;
    // let timerTurnManagerServiceSpy: TimerTurnManager;
    // let letterServiceSpy: LetterService;

    beforeEach(
        waitForAsync(() => {
            // letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange']);
            // timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['initiateGame']);
            // gameStateServiceSpy = jasmine.createSpyObj('GameStateService', ['placeLetter']);
            // placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['checkInput']);
            wordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', ['isPartOfWordVertical']);
            TestBed.configureTestingModule({
                providers: [{ provide: WordValidationService, useValue: wordValidationServiceSpy }],
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
});
