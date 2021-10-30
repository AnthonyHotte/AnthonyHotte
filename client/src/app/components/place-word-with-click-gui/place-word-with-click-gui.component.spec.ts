import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TextBox } from '@app/classes/text-box-behavior';
import { MessagePlayer } from '@app/message';
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
        textBoxSpy = jasmine.createSpyObj('ClickManagementService', ['send', 'isCommand']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        placeLetterServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['getLettersForExchange', 'submitWordMadeClick']);
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

    it('playWord should call submit word made with click', () => {
        const myMessage: MessagePlayer = { message: 'bonjour', sender: 'allo', role: 'Joueur' };
        placeLetterServiceSpy.submitWordMadeClick.and.returnValue(myMessage);
        component.playWord();
        expect(placeLetterServiceSpy.submitWordMadeClick).toHaveBeenCalled();
    });

    it('verifyWordCreated should return true if there is tile selected, player has 1 or more letter on board and it is player turn', () => {
        placeLetterClickServiceSpy.isTileSelected = true;
        placeLetterClickServiceSpy.lettersFromHand = 'aa';
        timeManagerSpy.turn = 0;
        expect(component.verifyWordCreated()).toBeTrue();
    });

    it('verifyWordCreated should return false if there is no tile selected, player has no letter on board and it is not player turn', () => {
        placeLetterClickServiceSpy.isTileSelected = false;
        placeLetterClickServiceSpy.lettersFromHand = '';
        timeManagerSpy.turn = 1;
        expect(component.verifyWordCreated()).toBeFalse();
    });
});
