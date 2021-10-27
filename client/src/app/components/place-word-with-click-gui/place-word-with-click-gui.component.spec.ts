import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceWordWithClickGuiComponent } from './place-word-with-click-gui.component';

describe('PlaceWordWithClickGuiComponent', () => {
    let component: PlaceWordWithClickGuiComponent;
    let fixture: ComponentFixture<PlaceWordWithClickGuiComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [PlaceWordWithClickGuiComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlaceWordWithClickGuiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
