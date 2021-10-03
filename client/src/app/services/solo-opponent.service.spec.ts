import { TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { SoloOpponentService } from './solo-opponent.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('SoloOpponentService', () => {
    let service: SoloOpponentService;
    let timerTurnManagerServiceSpy: TimerTurnManagerService;

    beforeEach(
        waitForAsync(() => {
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['initiateGame', 'endTurn']);

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
        const isMyTurn = timerTurnManagerServiceSpy.turn === 0;
        expect(isMyTurn).toBe(false);
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
        PlayerLetterHand.allLetters = [
            { letter: 'a', quantity: 1, point: 1 },
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'c', quantity: 1, point: 1 },
            { letter: 'd', quantity: 1, point: 1 },
            { letter: 'e', quantity: 1, point: 1 },
            { letter: 'f', quantity: 1, point: 1 },
            { letter: 'g', quantity: 1, point: 1 },
            { letter: 'h', quantity: 1, point: 1 },
        ];
        service.letters.players[1].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        const expectedNumberLetter = 7;
        service.reset(1);
        expect(service.letters.players[1].allLettersInHand.length).toBe(expectedNumberLetter);
    });

    it('skip turn should put myturn to false', () => {
        timerTurnManagerServiceSpy.turn = 1;
        service.skipTurn();
        const isMyTurn = timerTurnManagerServiceSpy.turn === 0;
        expect(isMyTurn).toBe(true);
    });
    it('skip turn should call endTurn', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const spy = spyOn(service, 'endTurn');
        service.skipTurn();
        expect(spy).toHaveBeenCalled();
    });
    it('exchangeLetters should call incrementPassedTurns', () => {
        const spy = spyOn(service, 'calculateProbability').and.returnValue(0);
        service.letters.players[1].allLettersInHand = [
            { letter: 'b', quantity: 1, point: 1 },
            { letter: 'c', quantity: 1, point: 1 },
        ];
        service.exchangeLetters(2);
        expect(spy).not.toHaveBeenCalled();
        expect(service.letters.players[1].allLettersInHand.length).toEqual(2);
    });
});
