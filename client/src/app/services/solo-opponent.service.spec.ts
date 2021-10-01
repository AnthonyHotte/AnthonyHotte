import { TestBed } from '@angular/core/testing';
import { SoloOpponentService } from './solo-opponent.service';
// import { GameStateService } from './game-state.service';
// import { LetterService } from './letter.service';
// import { PlaceLettersService } from './place-letters.service';
// import { SoloPlayerService } from './solo-player.service';
// import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('SoloOpponentService', () => {
    let service: SoloOpponentService;

    // let letterServiceSpy: LetterService;
    // let timerTurnManagerServiceSpy: TimerTurnManagerService;
    // let soloPlayerServiceSpy: SoloPlayerService;
    // let gameStateServiceSpy: GameStateService;
    // let placeLettersServiceSpy: PlaceLettersService;
    // let WordValidationServiceSpy: WordValidationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SoloOpponentService);
        // letterServiceSpy = jasmine.createSpyObj('LetterService', ['']);
        // timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['']);
        // soloPlayerServiceSpy = jasmine.createSpyObj('SoloPlayerService', ['']);
        // gameStateServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['']);
        // placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['']);
        // WordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', ['']);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    /*
    it('if its the first word to play and probabilityvalue > 20, then it should call findValidPlacesOnBoard', fakeAsync(() => {
        const spy = spyOn(service, 'findValidPlacesOnBoard');
        const returnedvalue = 21;
        const spy2 = spyOn(service, 'calculateProbability').and.returnValue(returnedvalue);
        service.myTurn = true;
        service.firstWordToPlay = false;
        service.play();
        flush();
        // service.PROBABILITY_OF_ACTION = 100;
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    }));

    it('play() if probability of points is less than 40 it should call findWordsToPlay', () => {
        const spy = spyOn(service, 'findWordsToPlay');
        const returnedvalue = 30;
        const spy2 = spyOn(service, 'calculateProbability').and.returnValue(returnedvalue);
        service.myTurn = true;
        service.firstWordToPlay = false;
        service.play();
        // service.PROBABILITY_OF_ACTION = 100;
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });
    it('incrementPassedTurns() with last turn skip should increamente valueToEndGame', () => {
        spyOn(window, 'parseInt').and.returnValue(0);
        service.maximumAllowedSkippedTurns = 3;
        // service.valueToEndGame = 0;
        service.incrementPassedTurns();
        expect(service.valueToEndGame).toBe(1);
        // const spy = spyOn(service, 'findWordsToPlay');
        // const returnedvalue = 30;
        // const spy2 = spyOn(service, 'calculateProbability').and.returnValue(returnedvalue);
        // service.myTurn = true;
        // service.firstWordToPlay = false;
        // service.play();
        // // service.PROBABILITY_OF_ACTION = 100;
        //  expect(spy).toHaveBeenCalled();
        //  expect(spy2).toHaveBeenCalled();
    }); */
});
