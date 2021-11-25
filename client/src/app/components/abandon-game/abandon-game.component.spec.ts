import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { AbandonGameComponent } from './abandon-game.component';
import { TextBox } from '@app/classes/text-box-behavior';

describe('AbandonGameComponent', () => {
    let component: AbandonGameComponent;
    let fixture: ComponentFixture<AbandonGameComponent>;
    let spy: jasmine.SpyObj<TextBox>;

    beforeEach(async () => {
        spy = jasmine.createSpyObj(TextBox, ['goToHomeAndRefresh', 'isCommand']);
        await TestBed.configureTestingModule({
            declarations: [AbandonGameComponent],
            providers: [{ provide: TextBox, useValue: spy }],
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
    it('beforeUnloadHandler should call iscommand', () => {
        component.beforeUnloadHandler();
        expect(spy.isCommand).toHaveBeenCalled();
    });
    it('finishCurrentGame should call finishedGameMessageTransmission', () => {
        component.finishCurrentGame();
        expect(spy.isCommand).toHaveBeenCalled();
    });
});
