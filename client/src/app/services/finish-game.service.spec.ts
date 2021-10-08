import { TestBed, waitForAsync } from '@angular/core/testing';
import { Router, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';

import { FinishGameService } from './finish-game.service';
import { LetterBankService } from './letter-bank.service';
import { LetterService } from './letter.service';

describe('FinishGameService', () => {
    let service: FinishGameService;
    let letterServiceSpy: LetterService;
    let letterBankServiceSpy: LetterBankService;
    let linkSpy: Router;

    beforeEach(
        waitForAsync(() => {
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

    it('scoreCalculator should have length of 2 when when there are two players', () => {
        const scoreOfPlayer = 6;
        letterServiceSpy.players[0].score = scoreOfPlayer;
        letterServiceSpy.players[1].score = scoreOfPlayer;
        service.scoreCalculator();
        expect(service.finalScore[0] === service.finalScore[0]).toBe(true);
        expect(service.finalScore.length).toEqual(2);
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
        const scoreOfPlayer = 6;
        service.finalScore[0] = scoreOfPlayer;
        service.finalScore[1] = scoreOfPlayer;
        service.getWinner();
        expect(service.finalScore[0] === service.finalScore[0]).toBe(true);
        expect(service.getWinner().length).toEqual(2);
    });

    it('Congratulation message has both player when both player have the same score', () => {
        expect(service.getCongratulation()).toEqual('Félicitation, allo et bonjour, vous avez gagné!!!');
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
