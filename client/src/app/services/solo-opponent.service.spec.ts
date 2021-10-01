import { TestBed, waitForAsync } from '@angular/core/testing';
import { LetterService } from './letter.service';
import { SoloOpponentService } from './solo-opponent.service';
import { SoloOpponent2Service } from './solo-opponent2.service';
import { SoloPlayerService } from './solo-player.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('SoloOpponentService', () => {
    let service: SoloOpponentService;
    let soloOpponent2ServiceSpy: SoloOpponent2Service;
    let timerTurnManagerServiceSpy: TimerTurnManagerService;
    let soloPlayerServiceSpy: SoloPlayerService;
    let letterServiceSpy: LetterService;

    beforeEach(
        waitForAsync(() => {
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['']);
            soloPlayerServiceSpy = jasmine.createSpyObj('SoloPlayerService', ['']);
            soloOpponent2ServiceSpy = jasmine.createSpyObj('SoloOpponent2Service', ['']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['']);
            TestBed.configureTestingModule({
                providers: [
                    { provide: TimerTurnManagerService, useValue: timerTurnManagerServiceSpy },
                    { provide: SoloOpponent2Service, useValue: soloOpponent2ServiceSpy },
                    { provide: SoloPlayerService, useValue: soloPlayerServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SoloOpponentService);
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
