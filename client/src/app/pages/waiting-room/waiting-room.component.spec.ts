import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { WaitingRoomComponent } from './waiting-room.component';

describe('WaitingRoomComponent', () => {
    let component: WaitingRoomComponent;
    let fixture: ComponentFixture<WaitingRoomComponent>;
    let timeTurnManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;

    beforeEach(async () => {
        timeTurnManagerSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
        socketServiceSpy = jasmine.createSpyObj('SocketService', ['cancelGame', 'handleDisconnect']);
        await TestBed.configureTestingModule({
            declarations: [WaitingRoomComponent],
            providers: [
                { provide: TimerTurnManagerService, useValue: timeTurnManagerSpy },
                { provide: SocketService, useValue: socketServiceSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(WaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('setsolotype should set type correctly', () => {
        timeTurnManagerSpy.gameStatus = 0;
        component.setSoloType();
        expect(timeTurnManagerSpy.gameStatus).toEqual(2);
    });
    it('cancelGame should call socket service cancel game', () => {
        component.cancelGame();
        expect(socketServiceSpy.cancelGame).toHaveBeenCalled();
    });
    it('should call handleDisconnect', () => {
        component.beforeUnloadHandler();
        expect(socketServiceSpy.handleDisconnect).toHaveBeenCalled();
    });
});
