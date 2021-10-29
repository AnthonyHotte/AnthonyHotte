import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TextBox } from '@app/classes/text-box-behavior';
import { PlaceLetterClickService } from '@app/services/place-letter-click.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

import { PlaceWordWithClickGuiComponent } from './place-word-with-click-gui.component';

describe('PlaceWordWithClickGuiComponent', () => {
    let component: PlaceWordWithClickGuiComponent;
    let fixture: ComponentFixture<PlaceWordWithClickGuiComponent>;
    let textBoxSpy: jasmine.SpyObj<TextBox>;
    let routerSpy: jasmine.SpyObj<Router>;
    let placeLetterServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let timeManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let placeLetterClickServiceSpy: jasmine.SpyObj<PlaceLetterClickService>;

    beforeEach(async () => {
        textBoxSpy = jasmine.createSpyObj('ClickManagementService', ['click']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        placeLetterServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['getLettersForExchange', 'reset']);
        placeLetterClickServiceSpy = jasmine.createSpyObj('PlaceLetterClickService', ['reset', 'caseSelected']);
        timeManagerSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn', 'initiateGame']);

        await TestBed.configureTestingModule({
            declarations: [PlaceWordWithClickGuiComponent],
            providers: [
                { provide: TextBox, useValue: textBoxSpy },
                { provide: Router, useValue: routerSpy },
                { provide: PlaceLettersService, useValue: placeLetterServiceSpy },
                { provide: TimerTurnManagerService, useValue: timeManagerSpy },
                { provide: PlaceLetterClickService, useValue: placeLetterClickServiceSpy },
            ],
            imports: [RouterTestingModule],
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
