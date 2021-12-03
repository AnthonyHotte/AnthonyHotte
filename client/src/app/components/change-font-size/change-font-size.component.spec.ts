import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GridService } from '@app/services/grid.service';
import { PlaceLettersService } from '@app/services/place-letters.service';

import { ChangeFontSizeComponent } from './change-font-size.component';

describe('ChangeFontSizeComponent', () => {
    let component: ChangeFontSizeComponent;
    let fixture: ComponentFixture<ChangeFontSizeComponent>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let placeLettersServiceSpy: jasmine.SpyObj<PlaceLettersService>;

    beforeEach(async () => {
        placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['policeSizeChanged']);
        gridServiceSpy = jasmine.createSpyObj('GridService', ['increasePoliceSize', 'decreasePoliceSize']);
        await TestBed.configureTestingModule({
            declarations: [ChangeFontSizeComponent],
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: PlaceLettersService, useValue: placeLettersServiceSpy },
            ],
            imports: [RouterTestingModule, HttpClientTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChangeFontSizeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('increaseFontSize should call policeSizeChanged', () => {
        component.increaseFontSize();
        expect(placeLettersServiceSpy.policeSizeChanged).toHaveBeenCalled();
    });
    it('decreaseFontSize should call policeSizeChanged', () => {
        component.decreaseFontSize();
        expect(placeLettersServiceSpy.policeSizeChanged).toHaveBeenCalled();
    });
});
