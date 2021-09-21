import { TestBed, waitForAsync } from '@angular/core/testing';
import { LetterService } from './letter.service';
import { GestionTimerTourService } from './gestion-timer-tour.service';
import { SoloPlayerService } from './solo-player.service';
import { BehaviorSubject, Observable } from 'rxjs';

describe('SoloPlayerService', () => {
    let service: SoloPlayerService;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let timeManagerSpy: jasmine.SpyObj<GestionTimerTourService>;

    beforeEach(
        waitForAsync(() => {
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['exchangeLettersForPlayer', 'addLettersForPlayer']);
            letterServiceSpy.currentMessage = new Observable<string>();
            letterServiceSpy.maxLettersInHand = 7;
            timeManagerSpy = jasmine.createSpyObj('GestionTimerTourService', ['initiateGame', 'sendTurn', 'endTurn']);
            timeManagerSpy.turn = 0;
            timeManagerSpy.currentMessage = new Observable<string>();
            timeManagerSpy.messageSource = new BehaviorSubject('default message');
            TestBed.configureTestingModule({
                providers: [
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: GestionTimerTourService, useValue: timeManagerSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SoloPlayerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('sendNumberOfSkippedTurn should call next method', () => {
        const sendNumberOfSkippedTurnSpy = spyOn(service.messageSource, 'next');
        service.sendNumberOfSkippedTurn();
        expect(sendNumberOfSkippedTurnSpy).toHaveBeenCalledWith(service.valueToEndGame.toString());
    });
    it('exchangeLetters should call exchangeLettersForPlayer', () => {
        service.exchangeLetters();
        expect(letterServiceSpy.exchangeLettersForPlayer).toHaveBeenCalled();
    });
    it('incrementPassedTurns should call changeTurn', () => {
        const incrementPassedTurnSpy = spyOn(service, 'changeTurn');
        service.incrementPassedTurns();
        expect(incrementPassedTurnSpy).toHaveBeenCalledWith(service.myTurn.toString());
    });
    it('incrementPassedTurns should have myturn = false', () => {
        service.incrementPassedTurns();
        expect(service.myTurn).toBe(false);
    });
    it('incrementPassedTurns should have valueToEndGame = 2', () => {
        service.valueToEndGame = 1;
        service.incrementPassedTurns();
        expect(service.valueToEndGame).toEqual(2);
    });
    it('getScore should return score = 8', () => {
        const expectedScore = 8;
        service.score = expectedScore;
        expect(service.getScore()).toEqual(expectedScore);
    });
    it('reset should have valueToEndGame = 0', () => {
        const valToEndGame = 8;
        service.valueToEndGame = valToEndGame;
        service.reset();
        expect(service.valueToEndGame).toEqual(0);
    });
    it('reset should call addLettersForPlayer()', () => {
        service.reset();
        expect(letterServiceSpy.addLettersForPlayer).toHaveBeenCalledWith(letterServiceSpy.maxLettersInHand);
    });
    it(' reset with expected number of letter set to 5 should have numberOfLetters = 5', () => {
        const expectedNumLetter = 5;
        service.message = '5';
        service.reset();
        expect(service.numberOfLetters).toEqual(expectedNumLetter);
    });
    it('changeTurn should call next() method', () => {
        const nextSpy = spyOn(service.messageSource, 'next');
        service.changeTurn('0');
        expect(nextSpy).toHaveBeenCalledWith('0');
    });
    it('changeTurn should have myTurn = false', () => {
        service.changeTurn('0');
        expect(service.myTurn).toBe(false);
    });
    it('changeTurn should have myTurn = true', () => {
        service.changeTurn('1');
        expect(service.myTurn).toBe(true);
    });
});
