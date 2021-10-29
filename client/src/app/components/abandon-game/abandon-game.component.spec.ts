import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbandonGameComponent } from './abandon-game.component';

describe('AbandonGameComponent', () => {
    let component: AbandonGameComponent;
    let fixture: ComponentFixture<AbandonGameComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [AbandonGameComponent],
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
});
