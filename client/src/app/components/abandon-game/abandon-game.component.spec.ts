import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishGameService } from '@app/services/finish-game.service';
import { RouterTestingModule } from '@angular/router/testing';

import { AbandonGameComponent } from './abandon-game.component';
import { SocketService } from '@app/services/socket.service';
import { BehaviorSubject } from 'rxjs';

describe('AbandonGameComponent', () => {
    let component: AbandonGameComponent;
    let fixture: ComponentFixture<AbandonGameComponent>;
    let spy: jasmine.SpyObj<FinishGameService>;
    let socketSpy: jasmine.SpyObj<SocketService>;

    beforeEach(async () => {
        socketSpy = jasmine.createSpyObj(SocketService, ['handleDisconnect', 'finishedGameMessageTransmission']);
        socketSpy.currentEndGameValue = new BehaviorSubject<boolean>(false);
        spy = jasmine.createSpyObj(FinishGameService, ['goToHomeAndRefresh', 'getCongratulation']);
        await TestBed.configureTestingModule({
            declarations: [AbandonGameComponent],
            providers: [
                { provide: FinishGameService, useValue: spy },
                { provide: SocketService, useValue: socketSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AbandonGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('beforeUnloadHandler should call handleDisconnect', () => {
        component.beforeUnloadHandler();
        expect(socketSpy.handleDisconnect).toHaveBeenCalled();
    });
    it('finishCurrentGame should call finishedGameMessageTransmission', () => {
        component.finishCurrentGame();
        expect(socketSpy.finishedGameMessageTransmission).toHaveBeenCalled();
    });

    it('setIsGameUnderway should return Finie when game is finished', () => {
        spy.isGameFinished = true;
        expect(component.setIsGameUnderway()).toEqual('Finie');
    });
    it('setIsGameUnderway should return En cours when game is not finished', () => {
        spy.isGameFinished = false;
        expect(component.setIsGameUnderway()).toEqual('En cours');
    });
});
