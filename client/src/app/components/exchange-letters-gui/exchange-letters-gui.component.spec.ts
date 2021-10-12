import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExchangeLettersGUIComponent } from './exchange-letters-gui.component';

describe('ExchangeLettersGUIComponent', () => {
    let component: ExchangeLettersGUIComponent;
    let fixture: ComponentFixture<ExchangeLettersGUIComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [ExchangeLettersGUIComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExchangeLettersGUIComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
