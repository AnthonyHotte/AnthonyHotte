import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameSelectionPageComponent } from './game-selection-page.component';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { LetterService } from '@app/services/letter.service';

describe('GameSelectionPageComponent', () => {
    let component: GameSelectionPageComponent;
    let fixture: ComponentFixture<GameSelectionPageComponent>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;
    let timeManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;

    beforeEach(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketService', ['sendGameListNeededNotification']);
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
});
