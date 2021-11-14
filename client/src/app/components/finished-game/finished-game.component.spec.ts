import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FinishedGameComponent } from './finished-game.component';
import { FinishGameService } from '@app/services/finish-game.service';
import { BehaviorSubject } from 'rxjs';

describe('FinishedGameComponent', () => {
    let component: FinishedGameComponent;
    let fixture: ComponentFixture<FinishedGameComponent>;
    let spy: jasmine.SpyObj<FinishGameService>;

    beforeEach(async () => {
        spy = jasmine.createSpyObj(FinishGameService, ['goToHomeAndRefresh', 'getCongratulation']);
        spy.updateOfEndGameValue = new BehaviorSubject<boolean>(false);
        spy.currentEndGameValue = spy.updateOfEndGameValue.asObservable();
        await TestBed.configureTestingModule({
            declarations: [FinishedGameComponent],
            providers: [{ provide: FinishGameService, useValue: spy }],
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
});
