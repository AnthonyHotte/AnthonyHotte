import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FinishGameService } from '@app/services/finish-game.service';
import { SocketService } from '@app/services/socket.service';
import { FinishedGameComponent } from './finished-game.component';

describe('FinishedGameComponent', () => {
    let component: FinishedGameComponent;
    let fixture: ComponentFixture<FinishedGameComponent>;
    let spy: jasmine.SpyObj<FinishGameService>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;

    beforeEach(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketService', ['getMessageObservable']);
        spy = jasmine.createSpyObj(FinishGameService, ['goToHomeAndRefresh', 'getCongratulation', 'getMessageCongratulationsAbandon']);
        await TestBed.configureTestingModule({
            declarations: [FinishedGameComponent],
            providers: [
                { provide: FinishGameService, useValue: spy },
                { provide: SocketService, useValue: socketServiceSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FinishedGameComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getter should be called congratulation', () => {
        component.getMessageCongratulation();
        expect(spy.getCongratulation).toHaveBeenCalled();
    });

    it('getter should be called getGameStatus', () => {
        const tempSpy = spyOn(component, 'getGameStatus');
        component.getGameStatus();
        expect(tempSpy).toHaveBeenCalled();
    });

    it('getter should be called congratulation', () => {
        component.quitGame();
        expect(spy.goToHomeAndRefresh).toHaveBeenCalled();
    });
    // it('getMessageCongratulationsAbandon should call getMessageCongratulationsAbandon from finishGameService', () => {
    //     component.getMessageCongratulationsAbandon();
    //     expect(spy.getMessageCongratulationsAbandon).toHaveBeenCalled();
    // });
    it('getGameStatus should return true', () => {
        spy.isGameFinished = true;
        socketServiceSpy.triggeredQuit = false;
        const res = component.getGameStatus();
        expect(res).toBe(true);
    });
    // it('getAbandonStatus should return true', () => {
    //     spy.isGameFinished = true;
    //     socketServiceSpy.triggeredQuit = true;
    //     const res = component.getAbandonStatus();
    //     expect(res).toBe(true);
    // });
});
