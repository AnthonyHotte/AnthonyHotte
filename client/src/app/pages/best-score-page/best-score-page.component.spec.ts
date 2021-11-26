import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BestScorePageComponent } from './best-score-page.component';

describe('BestScorePageComponent', () => {
    let component: BestScorePageComponent;
    let fixture: ComponentFixture<BestScorePageComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [BestScorePageComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(BestScorePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
