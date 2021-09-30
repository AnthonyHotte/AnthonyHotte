import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TextBox } from '@app/classes/text-box-behavior';
import { SidebarRightComponent } from '@app/components/sidebar-right/sidebar-right.component';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';

// import { SoloGameInformationService } from '@app/services/solo-game-information.service';

describe('SidebarRightComponent', () => {
    let component: SidebarRightComponent;
    let fixture: ComponentFixture<SidebarRightComponent>;
    let soloGameInformationServiceSpy: jasmine.SpyObj<SoloGameInformationService>;
    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let soloPlayerServiceSpy: jasmine.SpyObj<SoloPlayerService>;
    let soloOpponentServiceSpy: jasmine.SpyObj<SoloOpponentService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let textBoxSpy: jasmine.SpyObj<TextBox>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;

    beforeEach(
        waitForAsync(() => {
            soloGameInformationServiceSpy = jasmine.createSpyObj('SoloGameInformationService', ['sendMessage']);
            timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
            soloPlayerServiceSpy = jasmine.createSpyObj('SoloPlayerService', ['reset']);
            soloOpponentServiceSpy = jasmine.createSpyObj('SoloOpponentService', ['play']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange']);
            textBoxSpy = jasmine.createSpyObj('TextBox', ['send']);
            gridServiceSpy = jasmine.createSpyObj('GridService', ['getLettersForExchange']);
            placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['send']);
            TestBed.configureTestingModule({
                declarations: [SidebarRightComponent],
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
        expect(soloOpponentServiceSpy).toHaveBeenCalled();
    });
    it('setAttribute should finishCurrentGame when no message received', () => {
        component.message = [];
        const spy = spyOn(component, 'finishCurrentGame');
        component.setAttribute();
        expect(spy).toHaveBeenCalled();
        expect(soloOpponentServiceSpy).toHaveBeenCalled();
    });
});
