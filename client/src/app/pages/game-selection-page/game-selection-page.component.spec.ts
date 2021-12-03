import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LetterService } from '@app/services/letter.service';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { GameSelectionPageComponent } from './game-selection-page.component';

describe('GameSelectionPageComponent', () => {
    let component: GameSelectionPageComponent;
    let fixture: ComponentFixture<GameSelectionPageComponent>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;
    let timeManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;

    beforeEach(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketService', ['sendGameListNeededNotification', 'handleDisconnect']);
        timeManagerSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        await TestBed.configureTestingModule({
            declarations: [GameSelectionPageComponent],
            providers: [
                { provide: TimerTurnManagerService, useValue: timeManagerSpy },
                { provide: SocketService, useValue: socketServiceSpy },
                { provide: LetterService, useValue: letterServiceSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GameSelectionPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setCreateMultiPlayerGame should call reset', () => {
        component.setCreateMultiPlayerGame();
        expect(letterServiceSpy.reset).toHaveBeenCalled();
    });

    it('setSoloType should set game status to 2', () => {
        component.setSoloType();
        expect(timeManagerSpy.gameStatus).toEqual(2);
    });

    it('setJoinMultiPayerGame should call sendGameListNeededNotification', () => {
        component.setJoinMultiPayerGame();
        expect(socketServiceSpy.sendGameListNeededNotification).toHaveBeenCalled();
    });
    it('should get the mode', () => {
        const t = 'LOG2990';
        socketServiceSpy.is2990 = true;
        const returnn = component.getMode();
        expect(returnn).toBe(t);
    });
    it('should get the mode', () => {
        const t = 'Classique';
        socketServiceSpy.is2990 = false;
        const returnn = component.getMode();
        expect(returnn).toBe(t);
    });
    it('should call handleDisconnect', () => {
        component.beforeUnloadHandler();
        expect(socketServiceSpy.handleDisconnect).toHaveBeenCalled();
    });
});
