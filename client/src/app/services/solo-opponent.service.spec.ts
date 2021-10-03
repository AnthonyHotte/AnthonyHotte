import { TestBed, waitForAsync } from '@angular/core/testing';
import { SoloOpponentService } from './solo-opponent.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('SoloOpponentService', () => {
    let service: SoloOpponentService;
    let timerTurnManagerServiceSpy: TimerTurnManagerService;

    beforeEach(
        waitForAsync(() => {
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['initiateGame', 'endTurn']);
            timerTurnManagerServiceSpy.turn = 1;

            TestBed.configureTestingModule({
                providers: [{ provide: TimerTurnManagerService, useValue: timerTurnManagerServiceSpy }],
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

    it('play should not call calculate probability', () => {
        timerTurnManagerServiceSpy.turn = 0;
        service.play();
        expect(true).toBe(false);
    });

    it('play should call calculate probability and call skipTurn', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const returnValue = 5;
        const spy = spyOn(service, 'calculateProbability').and.returnValue(returnValue);
        const spy2 = spyOn(service, 'skipTurn');
        service.play();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('play should call calculate probability twice', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const returnValue = 12;
        const spy = spyOn(service, 'calculateProbability').and.returnValue(returnValue);
        const spy2 = spyOn(service, 'skipTurn');
        service.play();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy2).toHaveBeenCalled();
        expect(service).toBeTruthy();
    });

    it('calculateProbability should call calculate probability twice', () => {
        const spy = spyOn(Math, 'floor');
        const inputProb = 30;
        service.calculateProbability(inputProb);
        expect(spy).toHaveBeenCalled();
    });

    it('reset should put firstWordToPlay to true', () => {
        service.reset();
        expect(false).toBe(true);
    });

    it('exchangeLetters should call incrementPassedTurns', () => {
        const spy = spyOn(service, 'calculateProbability').and.returnValue(1);
        service.exchangeLetters(0);
        expect(spy).not.toHaveBeenCalled();
    });
    it('exchangeLetters should call incrementPassedTurns', () => {
        const spy = spyOn(service, 'calculateProbability').and.returnValue(0);
        service.exchangeLetters(0);
        expect(spy).not.toHaveBeenCalled();
    });
});
