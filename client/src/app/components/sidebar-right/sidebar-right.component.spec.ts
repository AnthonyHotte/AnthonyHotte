import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { TextBox } from '@app/classes/text-box-behavior';
import { SidebarRightComponent } from '@app/components/sidebar-right/sidebar-right.component';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
// import { CountdownComponent } from '@ciri/ngx-countdown';

// import { SoloPlayerService } from '@app/services/solo-player.service';
// import { SoloGameInformationService } from '@app/services/solo-game-information.service';

describe('SidebarRightComponent', () => {
    let component: SidebarRightComponent;
    let fixture: ComponentFixture<SidebarRightComponent>;

    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let soloOpponentServiceSpy: jasmine.SpyObj<SoloOpponentService>;

    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let textBoxSpy: jasmine.SpyObj<TextBox>;

    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let routerSpy: jasmine.SpyObj<Router>;
    // let counterSpy: jasmine.SpyObj<CountdownComponent>;
    // let soloPlayerServiceSpy: jasmine.SpyObj<SoloPlayerService>;
    // let soloGameInformationServiceSpy: jasmine.SpyObj<SoloGameInformationService>;
    beforeEach(
        waitForAsync(() => {
            /*
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
            soloPlayerServiceSpy = jasmine.createSpyObj('SoloPlayerService', ['reset']);
            soloOpponentServiceSpy = jasmine.createSpyObj('SoloOpponentService', ['reset']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange']);
            textBoxSpy = jasmine.createSpyObj('TextBox', ['send']);
            gridServiceSpy = jasmine.createSpyObj('GridService', ['increasePoliceSize']);
            placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['policeSizeChanged']);
            routerSpy = jasmine.createSpyObj('Router', ['navigate']);
            counterSpy = jasmine.createSpyObj('CountdownComponent', ['reset']);
            soloGameInformationServiceSpy = jasmine.createSpyObj('SoloGameInformationService', ['getMessage']);
            */

            TestBed.configureTestingModule({
                declarations: [
                    SidebarRightComponent /*
                    TimerTurnManagerService,
                    SoloOpponentService,
                    LetterService,
                    TextBox,
                    GridService,
                    PlaceLettersService,
                    Router,
                    CountdownComponent,
                    */,
                ],

                /*
                providers: [
                    { provide: TimerTurnManagerService, useValue: timerTurnManagerServiceSpy },
                    { provide: SoloOpponentService, useValue: soloOpponentServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: TextBox, useValue: textBoxSpy },
                    { provide: GridService, useValue: gridServiceSpy },
                    { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
                    { provide: Router, useValue: routerSpy },
                    { provide: CountdownComponent, useValue: counterSpy },
                    // { provide: SoloGameInformationService, useValue: soloGameInformationServiceSpy },
                    // { provide: SoloPlayerService, useValue: soloPlayerServiceSpy },
                ],
                */

                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(SidebarRightComponent);

        timerTurnManagerServiceSpy = TestBed.inject(TimerTurnManagerService) as jasmine.SpyObj<TimerTurnManagerService>;
        // soloPlayerServiceSpy = TestBed.inject(SoloPlayerService) as jasmine.SpyObj<SoloPlayerService>;
        soloOpponentServiceSpy = TestBed.inject(SoloOpponentService) as jasmine.SpyObj<SoloOpponentService>;

        letterServiceSpy = TestBed.inject(LetterService) as jasmine.SpyObj<LetterService>;
        textBoxSpy = TestBed.inject(TextBox) as jasmine.SpyObj<TextBox>;

        gridServiceSpy = TestBed.inject(GridService) as jasmine.SpyObj<GridService>;
        placeLettersServiceSpy = TestBed.inject(PlaceLettersService) as jasmine.SpyObj<PlaceLettersService>;
        routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
        // counterSpy = TestBed.inject(CountdownComponent) as jasmine.SpyObj<CountdownComponent>;
        // soloGameInformationServiceSpy = TestBed.inject(SoloGameInformationService) as jasmine.SpyObj<SoloGameInformationService>;

        component = fixture.componentInstance;
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
        const spy = spyOn(soloOpponentServiceSpy, 'reset');
        component.setAttribute();
        expect(component.playerName[0]).toMatch('firstName');
        expect(component.playerName[1]).toMatch('name');
        expect(component.easyDifficultyIsTrue).toBe(true);
        expect(component.time).toEqual(expectedTime);
        expect(spy).toHaveBeenCalled();
    });

    it('setAttribute should finishCurrentGame when no message received', () => {
        component.message = [];
        const spy = spyOn(component, 'finishCurrentGame');
        const spy2 = spyOn(soloOpponentServiceSpy, 'reset');
        component.setAttribute();
        expect(spy).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
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

    it('skipTurn should call soloOpponentPlays and set attributs commandSuccessful to false and opponentSet to true ', () => {
        const spy = spyOn(component, 'soloOpponentPlays');
        textBoxSpy.commandSuccessful = true;
        component.opponentSet = false;
        component.skipTurn();
        expect(spy).toHaveBeenCalled();
        expect(textBoxSpy.commandSuccessful).toBe(false);
        expect(component.opponentSet).toBe(true);
    });

    it('getNumberRemainingLetters should call sendLettersInSackNumber ', () => {
        const spy = spyOn(PlayerLetterHand, 'sendLettersInSackNumber');
        component.getNumberRemainingLetters();
        expect(spy).toHaveBeenCalled();
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

    it('finishCurrentGame should call navigate method ', () => {
        const spy = spyOn(routerSpy, 'navigate');
        component.finishCurrentGame();
        expect(spy).toHaveBeenCalled();
    });
    it('increaseFontSize should call navigate method ', () => {
        const spyIncrease = spyOn(gridServiceSpy, 'increasePoliceSize');
        const spyPolice = spyOn(placeLettersServiceSpy, 'policeSizeChanged');
        component.increaseFontSize();
        expect(spyIncrease).toHaveBeenCalled();
        expect(spyPolice).toHaveBeenCalled();
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
    /*
    it('verifyChangedTurns should return false when set to false ', () => {
        component.changedTurns = false;
        component.verifyChangedTurns(counterSpy);
        expect(component.changedTurns).toBe(false);
    });
    */
    /*
    it('verifyChangedTurns should return false when set to false and reset should be call ', () => {
        component.changedTurns = true;
        component.turn = 0;
        const spy = spyOn(counterSpy, 'reset');
        component.verifyChangedTurns(counterSpy);
        expect(spy).toHaveBeenCalled();
        expect(component.changedTurns).toBe(false);
    });

    it('verifyChangedTurns should return false when set to false and reset and soloOpponentPlays should be call', () => {
        component.changedTurns = true;
        component.turn = 1;
        const spy = spyOn(component, 'soloOpponentPlays');
        const spyCounter = spyOn(counterSpy, 'reset');
        component.verifyChangedTurns(counterSpy);
        expect(spyCounter).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
        expect(component.changedTurns).toBe(false);
    });
    */
    it('soloOpponentPlays should do nothing when turn equal 0', () => {
        timerTurnManagerServiceSpy.turn = 0;
        component.soloOpponentPlays();
        expect(timerTurnManagerServiceSpy.turn).toEqual(0);
    });
    it('soloOpponentPlays should do nothing when opponentSet is false', () => {
        timerTurnManagerServiceSpy.turn = 1;
        component.opponentSet = false;
        component.soloOpponentPlays();
        expect(timerTurnManagerServiceSpy.turn).toEqual(1);
        expect(component.opponentSet).toBe(false);
    });
    /*
    it('soloOpponentPlays should put changed turn to true', () => {
        timerTurnManagerServiceSpy.turn = 1;
        // const timeToWait2 = 25000;
        component.opponentSet = true;
        component.changedTurns = false;
        // const spy = spyOn(soloOpponentServiceSpy, 'play');
        // jasmine.clock().uninstall();
        // jasmine.clock().install();
        component.soloOpponentPlays();
        // setTimeout(() => {
        // expect(clearInterval).toHaveBeenCalled();
        // }, 3500);
        // jasmine.clock().tick(timeToWait);
        // iiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiiii
        // setTimeout(() => {
        // expect(spy).toHaveBeenCalled();
        // }, timeToWait2);
        // ooooooooooooooooooooooooooooooooooooooooo
        // expect(component.changedTurns).toBe(true);
        // jasmine.clock().uninstall();
    });
    */
});
