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
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { Observable } from 'rxjs';
import { FinishGameService } from '@app/services/finish-game.service';

describe('SidebarRightComponent', () => {
    let component: SidebarRightComponent;
    let fixture: ComponentFixture<SidebarRightComponent>;

    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let soloOpponentServiceSpy: jasmine.SpyObj<SoloOpponentService>;

    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let textBoxSpy: jasmine.SpyObj<TextBox>;
    let finishGameServiceSpy: jasmine.SpyObj<FinishGameService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let routerSpy: jasmine.SpyObj<Router>;
    let counterSpy: jasmine.SpyObj<CountdownComponent>;
    let soloGameInformationServiceSpy: jasmine.SpyObj<SoloGameInformationService>;
    beforeEach(
        waitForAsync(() => {
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn', 'initiateGame']);
            timerTurnManagerServiceSpy.turn = 0;
            soloOpponentServiceSpy = jasmine.createSpyObj('SoloOpponentService', ['reset', 'play']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange', 'reset']);
            letterServiceSpy.players = [new PlayerLetterHand(), new PlayerLetterHand()];
            textBoxSpy = jasmine.createSpyObj('TextBox', ['send', 'isCommand']);
            textBoxSpy.currentMessage = new Observable();
            gridServiceSpy = jasmine.createSpyObj('GridService', ['increasePoliceSize']);
            placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['policeSizeChanged']);
            routerSpy = jasmine.createSpyObj('Router', ['navigate']);
            counterSpy = jasmine.createSpyObj('CountdownComponent', ['reset']);
            soloGameInformationServiceSpy = jasmine.createSpyObj('SoloGameInformationService', ['getMessage']);
            soloGameInformationServiceSpy.message = [''];
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
                    { provide: SoloGameInformationService, useValue: soloGameInformationServiceSpy },
                    { provide: FinishGameService, useValue: finishGameServiceSpy },
                ],

                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarRightComponent);
        component = fixture.componentInstance;
        component.message = ['Jaque', 'Dupont', 'true', '10'];
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setAttribute should receive the message correctly', () => {
        component.message = ['firstName', 'name', 'true', '30'];
        const expectedTime = 30;
        component.playerName[0] = '';
        component.playerName[1] = '';
        component.easyDifficultyIsTrue = false;
        component.time = 0;
        component.setAttribute();
        expect(component.playerName[0]).toMatch('firstName');
        expect(component.playerName[1]).toMatch('name');
        expect(component.easyDifficultyIsTrue).toBe(true);
        expect(component.time).toEqual(expectedTime);
        expect(soloOpponentServiceSpy.reset).toHaveBeenCalled();
    });

    it('setAttribute should finishCurrentGame when no message received', () => {
        component.message = [];
        const spy = spyOn(component, 'finishCurrentGame');
        component.setAttribute();
        expect(spy).toHaveBeenCalled();
        expect(soloOpponentServiceSpy.reset).toHaveBeenCalled();
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
        letterServiceSpy.players = [new PlayerLetterHand(), new PlayerLetterHand()];
        letterServiceSpy.players[0].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        const expectedResult = 1;
        const result = component.getNumberOfLettersForPlayer(0);
        expect(result).toEqual(expectedResult);
    });
    it('getScorePlayer should return the score ', () => {
        const expectedResult = 1;
        letterServiceSpy.players = [new PlayerLetterHand(), new PlayerLetterHand()];
        letterServiceSpy.players[0].score = expectedResult;
        const result = component.getScorePlayer(0);
        expect(result).toEqual(expectedResult);
    });

    it('finishCurrentGame set isGameFinish to true ', () => {
        finishGameServiceSpy.isGameFinished = false;
        component.finishCurrentGame();
        expect(finishGameServiceSpy.isGameFinished).toBe(true);
    });
    it('increaseFontSize should call navigate method ', () => {
        component.increaseFontSize();
        expect(gridServiceSpy.increasePoliceSize).toHaveBeenCalled();
        expect(placeLettersServiceSpy.policeSizeChanged).toHaveBeenCalled();
    });
    it('getPlayerName should return the name when there is no changes in turn ', () => {
        component.turn = 0;
        timerTurnManagerServiceSpy.turn = 0;
        component.playerName[component.turn] = 'antho';
        const name = component.getPlayerName();
        expect(name).toMatch('antho');
    });
    it('getPlayerName should return the name when there is changes in turn ', () => {
        component.turn = 1;
        timerTurnManagerServiceSpy.turn = 0;
        component.playerName[0] = 'antho';
        const name = component.getPlayerName();
        expect(component.turn).toEqual(0);
        expect(name).toMatch('antho');
    });
    it('getPlayerName should return the name when there is changes in turn and turn equal zero and command is successful ', () => {
        component.turn = 0;
        timerTurnManagerServiceSpy.turn = 1;
        textBoxSpy.commandSuccessful = true;
        const spy = spyOn(component, 'soloOpponentPlays');
        component.playerName[1] = 'antho';
        const name = component.getPlayerName();
        expect(spy).toHaveBeenCalled();
        expect(component.turn).toEqual(1);
        expect(name).toMatch('antho');
    });

    it('getPlayerName should return the name when there is changes in turn and turn equal zero and command is successful ', () => {
        component.turn = 0;
        timerTurnManagerServiceSpy.turn = 1;
        textBoxSpy.commandSuccessful = false;
        component.playerName[1] = 'antho';
        const name = component.getPlayerName();
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
