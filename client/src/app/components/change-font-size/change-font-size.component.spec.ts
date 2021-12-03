import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { GridService } from '@app/services/grid.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { ChangeFontSizeComponent } from './change-font-size.component';

describe('ChangeFontSizeComponent', () => {
    let component: ChangeFontSizeComponent;
    let fixture: ComponentFixture<ChangeFontSizeComponent>;
    let grid: jasmine.SpyObj<GridService>;
    let placeLetter: jasmine.SpyObj<PlaceLettersService>;

    beforeEach(async () => {
        grid = jasmine.createSpyObj('GridService', ['increasePoliceSize', 'decreasePoliceSize']);
        placeLetter = jasmine.createSpyObj('PlaceLettersService', ['policeSizeChanged']);
        await TestBed.configureTestingModule({
            declarations: [ChangeFontSizeComponent],
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: ChangeFontSizeComponent, useValue: grid },
                { provide: PlaceLettersService, useValue: placeLetter },
            ],
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
    it('should call increasePoliceSize and policeSizeChanged', () => {
        component.increaseFontSize();
        expect(placeLetter.policeSizeChanged).toHaveBeenCalled();
    });
    it('should call decreasePoliceSize and policeSizeChanged', () => {
        component.decreaseFontSize();
        expect(placeLetter.policeSizeChanged).toHaveBeenCalled();
    });
});
