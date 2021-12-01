import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { FinishGameService } from './finish-game.service';
import { LetterBankService } from './letter-bank.service';
import { LetterService } from './letter.service';
import { SocketService } from './socket.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('FinishGameService', () => {
    let service: FinishGameService;
    let letterServiceSpy: LetterService;
    let letterBankServiceSpy: LetterBankService;
    let linkSpy: Router;
    let timeTurnManagerSpy: TimerTurnManagerService;
    let socketSpy: SocketService;

    beforeEach(
        waitForAsync(() => {
            socketSpy = jasmine.createSpyObj('SocketService', ['getMessageObservable', 'handleDisconnect']);
            timeTurnManagerSpy = jasmine.createSpyObj('timeTurnManagerSpy', ['endTurn']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
            letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
            letterServiceSpy.players = [new PlayerLetterHand(letterBankServiceSpy), new PlayerLetterHand(letterBankServiceSpy)];
            letterServiceSpy.players[0].allLettersInHand = [
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
            ];
            letterServiceSpy.players[1].allLettersInHand = [
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
                { letter: 'A', quantity: 1, point: 1 },
            ];
            letterServiceSpy.players[0].name = 'allo';
            letterServiceSpy.players[1].name = 'bonjour';
            linkSpy = jasmine.createSpyObj('Router', ['navigate']);
            TestBed.configureTestingModule({
                providers: [
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: Router, useValue: linkSpy },
                    { provide: TimerTurnManagerService, useValue: timeTurnManagerSpy },
                    { provide: SocketService, useValue: socketSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RouterModule],
            imports: [RouterTestingModule],
        });
        service = TestBed.inject(FinishGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    // it('getMessageCongratulationsAbandon should have length of 2 when when there are two players', () => {
    //     const expectedMessage = 'Félicitation, allo vous avez gagné. bonjour a abandonné';
    //     const message = service.getMessageCongratulationsAbandon();
    //     expect(message).toEqual(expectedMessage);
    // });

    it('scoreCalculator should have length of 2 when when there are two players', () => {
        const scoreOfPlayer = 6;
        letterServiceSpy.players[0].score = scoreOfPlayer;
        letterServiceSpy.players[1].score = scoreOfPlayer;
        service.scoreCalculator();
        expect(service.finalScore[0] === service.finalScore[0]).toBe(true);
        expect(service.finalScore.length).toEqual(2);
    });
    it('getWinner should return 1 when trigged quit', () => {
        service.finalScore = [1, 2];
        const winner = service.getWinner();
        expect(winner.length).toEqual(1);
        expect(winner[0]).toEqual(1);
    });
    it('getWinner should return 0 when player win', () => {
        socketSpy.triggeredQuit = false;
        service.finalScore[0] = 5;
        service.finalScore[1] = 2;
        const winner = service.getWinner();
        expect(winner.length).toEqual(1);
        expect(winner[0]).toEqual(0);
    });
    it('getWinner should return 1 when player lose', () => {
        socketSpy.triggeredQuit = false;
        service.finalScore[0] = 2;
        service.finalScore[1] = 5;
        const winner = service.getWinner();
        expect(winner.length).toEqual(1);
        expect(winner[0]).toEqual(1);
    });

    it('scoreCalculator should have have a length of 1 when one player has a score bigger than the other', () => {
        const scoreOfPlayer = 6;
        letterServiceSpy.players[0].score = scoreOfPlayer;
        letterServiceSpy.players[0].allLettersInHand = [];
        letterServiceSpy.players[1].score = scoreOfPlayer;
        service.scoreCalculator();
        expect(service.finalScore.length).toEqual(2);
        expect(service.finalScore[0] > service.finalScore[1]).toBe(true);
    });

    it('GetWinner should have have a length of 2 when both players have same score', () => {
        timeTurnManagerSpy.gameStatus = 0;
        const scoreOfPlayer = 6;
        service.finalScore[0] = scoreOfPlayer;
        service.finalScore[1] = scoreOfPlayer;
        const winners = service.getWinner();
        expect(service.finalScore[0] === service.finalScore[1]).toBe(true);
        expect(winners.length).toEqual(2);
    });

    it('Congratulation message has both player when both player have the same score', () => {
        const spy = spyOn(service, 'getWinner').and.returnValue([0, 1]);
        expect(service.getCongratulation()).toEqual('Félicitation, allo et bonjour! Vous avez fini à égalité.');
        expect(spy).toHaveBeenCalled();
    });

    it(' message textbox is the one asked in issue', () => {
        expect(service.getMessageTextBox()).toEqual(
            'Fin de partie - lettres restantes' + '\n' + 'allo : A A A A A A A' + '\n' + 'bonjour : A A A A A A A' + '\n',
        );
    });

    it('function navigate should be called ', () => {
        service.goToHomeAndRefresh();
        expect(linkSpy.navigate).toHaveBeenCalled();
    });
});
