import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND } from '@app/constants';
import { GameStatus } from '@app/game-status';
import { FinishGameService } from './finish-game.service';
import { LetterBankService } from './letter-bank.service';
import { LetterService } from './letter.service';
import { SoloOpponentService } from './solo-opponent.service';
import { SoloOpponent2Service } from './solo-opponent2.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('SoloOpponentService', () => {
    let service: SoloOpponentService;
    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let soloOpponent2ServiceSpy: jasmine.SpyObj<SoloOpponent2Service>;
    let finishGameServiceSpy: jasmine.SpyObj<FinishGameService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let routerSpy: Router;

    beforeEach(
        waitForAsync(() => {
            letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
            letterBankServiceSpy.letterBank = [];
            for (let i = 0; i < 3; i++) {
                letterBankServiceSpy.letterBank.push({ letter: 'A', quantity: 9, point: 1 });
            }
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['initiateGame', 'endTurn']);
            const player1 = new PlayerLetterHand(letterBankServiceSpy);
            player1.allLettersInHand = [];
            for (let i = 0; i < MAXLETTERINHAND; i++) {
                player1.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
            }
            const player2 = new PlayerLetterHand(letterBankServiceSpy);
            player2.allLettersInHand = [];
            for (let i = 0; i < MAXLETTERINHAND; i++) {
                player2.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
            }
            letterServiceSpy.players = [player1, player2];
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['reset', 'endTurn']);
            timerTurnManagerServiceSpy.gameStatus = GameStatus.SoloPlayer;
            letterServiceSpy.players = [new PlayerLetterHand(letterBankServiceSpy), new PlayerLetterHand(letterBankServiceSpy)];
            soloOpponent2ServiceSpy = jasmine.createSpyObj('SoloOpponent2Service', ['play']);
            finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['scoreCalculator']);
            finishGameServiceSpy.isGameFinished = false;
            routerSpy = jasmine.createSpyObj('Router', ['navigate']);

            TestBed.configureTestingModule({
                providers: [
                    { provide: Router, useValue: routerSpy },
                    { provide: TimerTurnManagerService, useValue: timerTurnManagerServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: SoloOpponent2Service, useValue: soloOpponent2ServiceSpy },
                    { provide: FinishGameService, useValue: finishGameServiceSpy },
                    { provide: LetterBankService, useValue: letterBankServiceSpy },
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

    it('play should call calculate probability twice when it exchanging', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const returnValue = 12;
        const spy = spyOn(service, 'calculateProbability').and.returnValue(returnValue);
        const spy2 = spyOn(service, 'skipTurn');
        service.play();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy2).toHaveBeenCalled();
    });

    it('play should call calculate probability twice when it exchanging and should exchange if there is enough letters', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const firstReturnValue = 12;
        const secondReturnValue = 3;
        const spy = spyOn(service, 'calculateProbability').and.returnValues(firstReturnValue, secondReturnValue);
        const spy2 = spyOn(service, 'endTurn');
        const spy3 = spyOn(service, 'exchangeLetters');
        service.play();
        expect(spy).toHaveBeenCalledTimes(2);
        expect(spy2).toHaveBeenCalled();
        expect(spy3).toHaveBeenCalled();
    });

    it('play should call calculate probability twice when it playing', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const returnValue = 25;
        const spy = spyOn(service, 'calculateProbability').and.returnValue(returnValue);
        const spy2 = spyOn(service, 'endTurn');
        service.play();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(soloOpponent2ServiceSpy.play).toHaveBeenCalled();
    });

    it('calculateProbability should call floor twice', () => {
        const spy = spyOn(Math, 'floor');
        const inputProb = 30;
        service.calculateProbability(inputProb);
        expect(spy).toHaveBeenCalled();
    });

    it('reset should put firstWordToPlay to true', () => {
        letterBankServiceSpy.letterBank = [
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

    it('endTurn should call endTurn and finish game when opponent hand is empty', () => {
        timerTurnManagerServiceSpy.turn = 0;
        letterServiceSpy.players[0].allLettersInHand = [];
        service.endTurn('place');
        expect(timerTurnManagerServiceSpy.endTurn).toHaveBeenCalled();
        expect(finishGameServiceSpy.isGameFinished).toBeTrue();
    });

    it('endTurn should call endTurn and not finish game when opponent hand is not empty', () => {
        timerTurnManagerServiceSpy.turn = 1;
        service.endTurn('place');
        timerTurnManagerServiceSpy.turn = 0;
        expect(timerTurnManagerServiceSpy.endTurn).toHaveBeenCalled();
        expect(finishGameServiceSpy.isGameFinished).toBeFalse();
    });

    it('exchangeLetters should exchange letters', () => {
        timerTurnManagerServiceSpy.turn = 1;
        const firstReturnValue = 0;
        const secondReturnValue = 1;
        const thirdReturnValue = 0;
        const fourthReturnValue = 2;
        const spy = spyOn(service, 'calculateProbability').and.returnValues(firstReturnValue, secondReturnValue, thirdReturnValue, fourthReturnValue);
        const spy2 = spyOn(letterServiceSpy.players[timerTurnManagerServiceSpy.turn], 'exchangeLetters');
        service.exchangeLetters(3);
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
    });

    it('play should not call calculateProbability if game status is not 2', () => {
        timerTurnManagerServiceSpy.gameStatus = 1;
        const spy = spyOn(service, 'calculateProbability');
        service.play();
        expect(spy).not.toHaveBeenCalled();
    });
});
