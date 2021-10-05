import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { FinishGameService } from './finish-game.service';
import { LetterService } from './letter.service';
import { SoloOpponentService } from './solo-opponent.service';
import { SoloOpponent2Service } from './solo-opponent2.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('SoloOpponentService', () => {
    let service: SoloOpponentService;
    let timerTurnManagerServiceSpy: TimerTurnManagerService;
    let letterServiceSpy: LetterService;
    let soloOpponent2ServiceSpy: SoloOpponent2Service;
    let finishGameServiceSpy: FinishGameService;
    let routerSpy: Router;

    beforeEach(
        waitForAsync(() => {
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['initiateGame', 'endTurn']);
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['reset']);
            letterServiceSpy.players = [new PlayerLetterHand(), new PlayerLetterHand()];
            soloOpponent2ServiceSpy = jasmine.createSpyObj('SoloOpponent2Service', ['play']);
            finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['scoreCalculator']);
            routerSpy = jasmine.createSpyObj('Router', ['navigate']);

            TestBed.configureTestingModule({
                providers: [
                    { provide: Router, useValue: routerSpy },
                    { provide: TimerTurnManagerService, useValue: timerTurnManagerServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: SoloOpponent2Service, useValue: soloOpponent2ServiceSpy },
                    { provide: FinishGameService, useValue: finishGameServiceSpy },
                ],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        service = TestBed.inject(SoloOpponentService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it("play should not call calculate probability when it isn't the solo opponent's turn", () => {
        timerTurnManagerServiceSpy.turn = 0;
        const spy = spyOn(service, 'calculateProbability');
        service.play();
        expect(spy).not.toHaveBeenCalled();
    });

    it('play should call calculate probability and call skipTurn', () => {
        timerTurnManagerServiceSpy.turn = 1;
        service.lastCommandEntered = '';
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

    it('skip turn should do nothing', () => {
        timerTurnManagerServiceSpy.turn = 0;
        service.skipTurn();
        expect(timerTurnManagerServiceSpy.turn).toEqual(0);
    });
    it('skip turn should call endTurn', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const spy = spyOn(service, 'endTurn');
        service.skipTurn();
        expect(spy).toHaveBeenCalled();
    });
});
