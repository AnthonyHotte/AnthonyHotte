import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { TextBox } from '@app/classes/text-box-behavior';
import { SidebarRightComponent } from '@app/components/sidebar-right/sidebar-right.component';
import { FinishGameService } from '@app/services/finish-game.service';
import { GridService } from '@app/services/grid.service';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterClickService } from '@app/services/place-letter-click.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { CountdownComponent } from '@ciri/ngx-countdown';

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
    let placeLetterClickServiceSpy: jasmine.SpyObj<PlaceLetterClickService>;
    beforeEach(
        waitForAsync(() => {
            placeLetterClickServiceSpy = jasmine.createSpyObj('PlaceLetterClickService', ['placeLetter', 'reset']);
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

            textBoxSpy = jasmine.createSpyObj('TextBox', ['send', 'isCommand', 'scrollDown']);
            textBoxSpy.inputs = [];
            gridServiceSpy = jasmine.createSpyObj('GridService', ['increasePoliceSize', 'decreasePoliceSize']);
            placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['policeSizeChanged']);
            routerSpy = jasmine.createSpyObj('Router', ['navigate']);
            counterSpy = jasmine.createSpyObj('CountdownComponent', ['reset', 'pause']);
            finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['scoreCalculator']);
            TestBed.configureTestingModule({
                declarations: [SidebarRightComponent],
                providers: [
                    { provide: PlaceLetterClickService, useValue: placeLetterClickServiceSpy },
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
        timerTurnManagerServiceSpy.gameStatus = 2;
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

    it('soloOpponentPlays should be called when game status 2 and its his turn afterview init', () => {
        timerTurnManagerServiceSpy.turn = 1;
        timerTurnManagerServiceSpy.gameStatus = 2;
        const mySpy = spyOn(component, 'soloOpponentPlays');
        component.ngAfterViewInit();
        expect(mySpy).toHaveBeenCalled();
    });

    it('soloOpponentPlays should not be called when game status is not 2 and its not his turn afterview init', () => {
        timerTurnManagerServiceSpy.turn = 0;
        timerTurnManagerServiceSpy.gameStatus = 0;
        const mySpy = spyOn(component, 'soloOpponentPlays');
        component.ngAfterViewInit();
        expect(mySpy).not.toHaveBeenCalled();
    });

    it('setAttribute should call reset when game status 2', () => {
        timerTurnManagerServiceSpy.turn = 1;
        timerTurnManagerServiceSpy.gameStatus = 2;
        component.setAttribute();
        expect(letterServiceSpy.reset).toHaveBeenCalled();
    });

    it('setAttribute should not call reset when game status not 2', () => {
        timerTurnManagerServiceSpy.turn = 1;
        timerTurnManagerServiceSpy.gameStatus = 0;
        component.setAttribute();
        expect(letterServiceSpy.reset).not.toHaveBeenCalled();
    });

    it('skipTurn should not call soloOpponentPlays when game status is not 2 and it is not his turn', () => {
        timerTurnManagerServiceSpy.turn = 0;
        timerTurnManagerServiceSpy.gameStatus = 0;
        spyOn(textBoxSpy.inputs, 'push');
        const mySpy = spyOn(component, 'soloOpponentPlays');
        component.skipTurn();
        expect(mySpy).not.toHaveBeenCalled();
    });

    it('decreaseFontSize should call decreasePoliceSize and policeSizeChanged', () => {
        component.decreaseFontSize();
        expect(gridServiceSpy.decreasePoliceSize).toHaveBeenCalled();
        expect(placeLettersServiceSpy.policeSizeChanged).toHaveBeenCalled();
    });

    it('verifyChangedTurns should call pause() if game is finished', () => {
        finishGameServiceSpy.isGameFinished = true;
        component.verifyChangedTurns(counterSpy);
        expect(counterSpy.pause).toHaveBeenCalled();
    });

    it('soloOpponentPlayse should call delay if game status is 2', () => {
        timerTurnManagerServiceSpy.gameStatus = 2;
        const mySpy = spyOn(component, 'delay');
        component.soloOpponentPlays();
        expect(mySpy).toHaveBeenCalled();
    });

    it('soloOpponentPlayse should not call delay if game status is not 2', () => {
        timerTurnManagerServiceSpy.gameStatus = 0;
        const mySpy = spyOn(component, 'delay');
        component.soloOpponentPlays();
        expect(mySpy).not.toHaveBeenCalled();
    });

    it('delay should call setTimeout', () => {
        spyOn(window, 'setTimeout');
        component.delay(2);
        expect(setTimeout).toHaveBeenCalled();
    });
});
