import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FinishGameService } from '@app/services/finish-game.service';
import { RouterTestingModule } from '@angular/router/testing';

import { AbandonGameComponent } from './abandon-game.component';

describe('AbandonGameComponent', () => {
    let component: AbandonGameComponent;
    let fixture: ComponentFixture<AbandonGameComponent>;
    let spy: jasmine.SpyObj<FinishGameService>;

    beforeEach(async () => {
        spy = jasmine.createSpyObj(FinishGameService, ['goToHomeAndRefresh', 'getCongratulation']);
        await TestBed.configureTestingModule({
            declarations: [AbandonGameComponent],
            providers: [{ provide: FinishGameService, useValue: spy }],
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
});
