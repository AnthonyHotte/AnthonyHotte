import { TestBed, waitForAsync } from '@angular/core/testing';
import { BehaviorSubject, Observable } from 'rxjs';
import { SoloOpponentService } from './solo-opponent.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

fdescribe('SoloOpponentService', () => {
    let service: SoloOpponentService;
    let timerTurnManagerServiceSpy: TimerTurnManagerService;

    beforeEach(
        waitForAsync(() => {
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['initiateGame', 'endTurn']);
            timerTurnManagerServiceSpy.messageSource = new BehaviorSubject('default message');
            timerTurnManagerServiceSpy.turn = 1;
            timerTurnManagerServiceSpy.currentMessage = new Observable();

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
        service.myTurn = true;
        timerTurnManagerServiceSpy.turn = 0;
        service.play();
        expect(service.myTurn).toBe(false);
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
    it('incrementPassedTurns should have value to end game equal to 2', () => {
        service.messageFromSoloPlayer[0] = '1';
        service.messageFromSoloPlayer[1] = 'true';
        service.maximumAllowedSkippedTurns = 10;
        service.incrementPassedTurns();
        expect(service.valueToEndGame).toEqual(2);
    });
    it('incrementPassedTurns should have value to end game equal to 1', () => {
        service.messageFromSoloPlayer[0] = '1';
        service.messageFromSoloPlayer[1] = 'false';
        service.maximumAllowedSkippedTurns = 10;
        service.incrementPassedTurns();
        expect(service.valueToEndGame).toEqual(1);
    });
    it('incrementPassedTurns should put myTurn to false', () => {
        service.messageFromSoloPlayer[0] = '15';
        service.messageFromSoloPlayer[1] = 'true';
        service.maximumAllowedSkippedTurns = 10;
        const expectedValue = 15;
        service.incrementPassedTurns();
        expect(service.valueToEndGame).toEqual(expectedValue);
    });
    it('changeTurn should call next method', () => {
        const spy = spyOn(service.messageSource, 'next');
        service.changeTurn('Hello');
        expect(spy).toHaveBeenCalled();
    });

    it('reset should put firstWordToPlay to true', () => {
        service.reset();
        expect(service.firstWordToPlay).toBe(true);
    });
    it('getScore should getScore correctly', () => {
        const scoreValue = 10;
        service.score = scoreValue;
        const result = service.getScore();
        expect(result).toBe(scoreValue);
    });
    it('sendNumberOfSkippedTurn should call next method', () => {
        const spy = spyOn(service.messageSource, 'next');
        service.sendNumberOfSkippedTurn();
        expect(spy).toHaveBeenCalled();
    });

    it('skip turn should put myturn to false', () => {
        timerTurnManagerServiceSpy.turn = 0;
        service.skipTurn();
        expect(service.myTurn).toBe(false);
    });
    it('skip turn should call incrementPassedTurns', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const spy = spyOn(service, 'incrementPassedTurns');
        service.skipTurn();
        expect(spy).toHaveBeenCalled();
    });
    it('exchangeLetters should call incrementPassedTurns', () => {
        const spy = spyOn(service, 'calculateProbability').and.returnValue(1);
        service.letters.players[1].selectedLettersForExchange = new Set<number>([0]);
        service.exchangeLetters(1);
        expect(spy).toHaveBeenCalled();
        expect(service.letters.players[1].selectedLettersForExchange.size).toEqual(1);
    });
    it('exchangeLetters should call incrementPassedTurns', () => {
        const spy = spyOn(service, 'calculateProbability').and.returnValue(0);
        service.letters.players[1].selectedLettersForExchange = new Set<number>([0]);
        service.exchangeLetters(1);
        expect(spy).toHaveBeenCalled();
        expect(service.letters.players[1].selectedLettersForExchange.size).toEqual(1);
    });
});
