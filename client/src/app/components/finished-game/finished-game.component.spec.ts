import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FinishedGameComponent } from './finished-game.component';
import { FinishGameService } from '@app/services/finish-game.service';

describe('FinishedGameComponent', () => {
    let component: FinishedGameComponent;
    let fixture: ComponentFixture<FinishedGameComponent>;
    let spy: jasmine.SpyObj<FinishGameService>;

    beforeEach(async () => {
        spy = jasmine.createSpyObj(FinishGameService, ['scoreCalculator']);
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
});
