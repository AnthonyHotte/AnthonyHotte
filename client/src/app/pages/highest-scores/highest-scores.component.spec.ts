import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HighestScoresComponent } from './highest-scores.component';

describe('HighestScoresComponent', () => {
    let component: HighestScoresComponent;
    let fixture: ComponentFixture<HighestScoresComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [HighestScoresComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(HighestScoresComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
