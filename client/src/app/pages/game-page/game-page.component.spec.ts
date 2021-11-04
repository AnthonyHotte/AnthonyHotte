import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ClickManagementService } from '@app/services/click-management.service';
import { GamePageComponent } from './game-page.component';

describe('GamePageComponent', () => {
    let component: GamePageComponent;
    let fixture: ComponentFixture<GamePageComponent>;
    let clickManagerSpy: jasmine.SpyObj<ClickManagementService>;
    let routerSpy: jasmine.SpyObj<Router>;
    beforeEach(async () => {
        clickManagerSpy = jasmine.createSpyObj('ClickManagementService', ['click']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);

        await TestBed.configureTestingModule({
            declarations: [GamePageComponent],
            providers: [
                { provide: ClickManagementService, useValue: clickManagerSpy },
                { provide: Router, useValue: routerSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(GamePageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('click should call click from click manager create', () => {
        component.clickLocation('textBox');
        expect(clickManagerSpy.click).toHaveBeenCalled();
    });
});
