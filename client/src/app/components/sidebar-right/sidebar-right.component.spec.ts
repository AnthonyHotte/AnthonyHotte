import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TextBox } from '@app/classes/text-box-behavior';
import { SidebarRightComponent } from '@app/components/sidebar-right/sidebar-right.component';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { CountdownComponent } from '@ciri/ngx-countdown';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { FinishGameService } from '@app/services/finish-game.service';
import { LetterBankService } from '@app/services/letter-bank.service';

describe('SidebarRightComponent', () => {
    let component: SidebarRightComponent;
    let fixture: ComponentFixture<SidebarRightComponent>;

    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let soloOpponentServiceSpy: jasmine.SpyObj<SoloOpponentService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let textBoxSpy: jasmine.SpyObj<TextBox>;
    let finishGameServiceSpy: jasmine.SpyObj<FinishGameService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let counterSpy: jasmine.SpyObj<CountdownComponent>;
    beforeEach(
        waitForAsync(() => {
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn', 'initiateGame']);
            timerTurnManagerServiceSpy.turn = 0;
            soloOpponentServiceSpy = jasmine.createSpyObj('SoloOpponentService', ['reset', 'play']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange', 'reset']);
            letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
            letterBankServiceSpy.letterBank = [];
            for (let i = 0; i < 3; i++) {
                letterBankServiceSpy.letterBank.push({ letter: 'A', quantity: 9, point: 1 });
            }
            letterServiceSpy.players = [new PlayerLetterHand(letterBankServiceSpy), new PlayerLetterHand(letterBankServiceSpy)];

            textBoxSpy = jasmine.createSpyObj('TextBox', ['send', 'isCommand']);
            gridServiceSpy = jasmine.createSpyObj('GridService', ['increasePoliceSize']);
            placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['policeSizeChanged']);
            routerSpy = jasmine.createSpyObj('Router', ['navigate']);
            counterSpy = jasmine.createSpyObj('CountdownComponent', ['reset']);
            finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['scoreCalculator']);
            TestBed.configureTestingModule({
                declarations: [SidebarRightComponent],
                providers: [
                    { provide: TimerTurnManagerService, useValue: timerTurnManagerServiceSpy },
                    { provide: SoloOpponentService, useValue: soloOpponentServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: TextBox, useValue: textBoxSpy },
                    { provide: GridService, useValue: gridServiceSpy },
                    { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
                    { provide: Router, useValue: routerSpy },
                    { provide: CountdownComponent, useValue: counterSpy },
                    { provide: FinishGameService, useValue: finishGameServiceSpy },
                    { provide: LetterBankService, useValue: letterBankServiceSpy },
                ],

                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarRightComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('difficultyInCharacters should return Débutant ', () => {
        component.easyDifficultyIsTrue = true;
        const expectedResult = component.difficultyInCharacters();
        expect(expectedResult).toMatch('Débutant');
    });

    it('difficultyInCharacters should return Expert ', () => {
        component.easyDifficultyIsTrue = false;
        const expectedResult = component.difficultyInCharacters();
        expect(expectedResult).toMatch('Expert');
    });

    it('getNumberOfLettersForPlayer should return the number of letters ', () => {
        letterServiceSpy.players = [new PlayerLetterHand(letterBankServiceSpy), new PlayerLetterHand(letterBankServiceSpy)];
        letterServiceSpy.players[0].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        const expectedResult = 1;
        const result = component.getNumberOfLettersForPlayer(0);
        expect(result).toEqual(expectedResult);
    });
    it('getScorePlayer should return the score ', () => {
        const expectedResult = 1;
        letterServiceSpy.players = [new PlayerLetterHand(letterBankServiceSpy), new PlayerLetterHand(letterBankServiceSpy)];
        letterServiceSpy.players[0].score = expectedResult;
        const result = component.getScorePlayer(0);
        expect(result).toEqual(expectedResult);
    });

    it('finishCurrentGame set isGameFinish to true ', () => {
        finishGameServiceSpy.isGameFinished = false;
        component.finishCurrentGame();
        expect(finishGameServiceSpy.isGameFinished).toBe(true);
    });
    it('increaseFontSize should call ncreasePoliceSize and policeSizeChanged method ', () => {
        component.increaseFontSize();
        gridServiceSpy.increasePoliceSize.and.returnValue();
        expect(gridServiceSpy.increasePoliceSize).toHaveBeenCalled();
        expect(placeLettersServiceSpy.policeSizeChanged).toHaveBeenCalled();
    });
    it('getPlayerName should return the name when there is no changes in turn ', () => {
        component.turn = 0;
        timerTurnManagerServiceSpy.turn = 0;
        letterServiceSpy.players[0].name = 'antho';
        const name = component.getPlayerNameAndVerifyTurn();
        expect(name).toMatch('antho');
    });
    it('getPlayerName should return the name when there is changes in turn ', () => {
        component.turn = 1;
        timerTurnManagerServiceSpy.turn = 0;
        letterServiceSpy.players[0].name = 'antho';
        const name = component.getPlayerNameAndVerifyTurn();
        expect(component.turn).toEqual(0);
        expect(name).toMatch('antho');
    });
    it('getPlayerName should return the name when there is changes in turn and turn equal zero and command is successful ', () => {
        component.turn = 0;
        timerTurnManagerServiceSpy.turn = 1;
        textBoxSpy.commandSuccessful = true;
        const spy = spyOn(component, 'soloOpponentPlays');
        letterServiceSpy.players[1].name = 'antho';
        const name = component.getPlayerNameAndVerifyTurn();
        expect(spy).toHaveBeenCalled();
        expect(component.turn).toEqual(1);
        expect(name).toMatch('antho');
    });

    it('getPlayerName should return the name when there is changes in turn and turn equal zero and command is successful ', () => {
        component.turn = 0;
        timerTurnManagerServiceSpy.turn = 1;
        textBoxSpy.commandSuccessful = false;
        letterServiceSpy.players[1].name = 'antho';
        const name = component.getPlayerNameAndVerifyTurn();
        expect(component.turn).toEqual(1);
        expect(name).toMatch('antho');
    });

    it('verifyChangedTurns should return false when set to false ', () => {
        component.changedTurns = false;
        component.verifyChangedTurns(counterSpy);
        expect(component.changedTurns).toBe(false);
    });

    it('verifyChangedTurns should return false when set to false and reset should be call ', () => {
        component.changedTurns = true;
        component.turn = 0;
        component.verifyChangedTurns(counterSpy);
        expect(counterSpy.reset).toHaveBeenCalled();
        expect(component.changedTurns).toBe(false);
    });
});
