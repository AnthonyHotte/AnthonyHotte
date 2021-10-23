import { TestBed, waitForAsync } from '@angular/core/testing';
import { GameStateService } from './game-state.service';
import { PlaceLettersService } from './place-letters.service';
import { SoloOpponent2Service } from './solo-opponent2.service';
import { LetterService } from '@app/services/letter.service';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { LetterBankService } from '@app/services/letter-bank.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
import { NUMBEROFCASE, MAXLETTERINHAND } from '@app/constants';

describe('SoloOpponent2Service', () => {
    let service: SoloOpponent2Service;
    let placeLettersServiceSpy: PlaceLettersService;
    let gameStateServiceSpy: GameStateService;
    let lettersServiceSpy: LetterService;
    let letterBankServiceSpy: LetterBankService;
    let timeManagerServiceSpy: TimerTurnManagerService;
    beforeEach(
        waitForAsync(() => {
            timeManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
            timeManagerServiceSpy.turn = 0;
            gameStateServiceSpy = jasmine.createSpyObj('GameStateService', [
                'placeLetter',
                'isWordCreationPossibleWithRessources',
                'isLetterOnh8',
                'isWordTouchingLetterOnBoard',
                'validateWordCreatedByNewLetters',
            ]);
            gameStateServiceSpy.lettersOnBoard = [];
            for (let i = 0; i < NUMBEROFCASE; i++) {
                gameStateServiceSpy.lettersOnBoard[i] = [];
                for (let j = 0; j < NUMBEROFCASE; j++) {
                    gameStateServiceSpy.lettersOnBoard[i][j] = '';
                }
            }
            letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
            lettersServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
            const player1 = new PlayerLetterHand(letterBankServiceSpy);
            for (let i = 0; i < MAXLETTERINHAND; i++) {
                player1.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
            }
            const player2 = new PlayerLetterHand(letterBankServiceSpy);
            for (let i = 0; i < MAXLETTERINHAND; i++) {
                player2.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
            }
            lettersServiceSpy.players = [player1, player2];
            placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', [
                'placeWord',
                'removeLetterInGameState',
                'placeWordGameState',
                'verifyAvailable',
                'verifyTileNotOutOfBound',
            ]);
            TestBed.configureTestingModule({
                providers: [
                    { provide: GameStateService, useValue: gameStateServiceSpy },
                    { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
                    { provide: LetterService, useValue: lettersServiceSpy },
                    { provide: LetterBankService, useValue: letterBankServiceSpy },
                    { provide: TimerTurnManagerService, useValue: timeManagerServiceSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        service = TestBed.inject(SoloOpponent2Service);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('should find valid word', () => {
        const dictionnary = ['allo', 'test', 'bonjour'];
        const letters = ['a', 'l', 'l', 'o'];
        const returnedvalue = service.findValidWords(dictionnary, letters);
        service.play();
        expect(returnedvalue[0]).toBe('allo');
    });
    it('should find valid word', () => {
        const dictionnary = ['allo', 'test', 'bonjour'];
        const letters = ['a', 'l', 'l', 'o'];
        const returnedvalue = service.findValidWords(dictionnary, letters);
        service.play();
        expect(returnedvalue[0]).toBe('allo');
    });

    it('should find place word for first word', () => {
        gameStateServiceSpy.isBoardEmpty = true;
        service.play();
        expect(placeLettersServiceSpy.placeWord).toHaveBeenCalled();
    });
    it("should verify word isn't valid", () => {
        const result = service.findValidWords(['allo', 'okay'], ['l', 'e']);
        expect(result.length).toEqual(0);
    });
    it('isWordPlayable should return false', () => {
        const result = service.isWordPlayable('allo', 1, 1, 'h');
        expect(result).toBe(false);
    });
});
