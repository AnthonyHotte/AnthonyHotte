import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { TextBox } from '@app/classes/text-box-behavior';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

import { ExchangeLettersGUIComponent } from './exchange-letters-gui.component';

describe('ExchangeLettersGUIComponent', () => {
    let component: ExchangeLettersGUIComponent;
    let fixture: ComponentFixture<ExchangeLettersGUIComponent>;
    let timeManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let textBoxSpy: jasmine.SpyObj<TextBox>;

    beforeEach(async () => {
        timeManagerSpy = jasmine.createSpyObj(TimerTurnManagerService, ['endTurn']);
        timeManagerSpy.turn = 0;
        letterServiceSpy = jasmine.createSpyObj(LetterService, ['removeAttributesExchange']);
        letterServiceSpy.areLetterSelectedExchange = true;
        letterBankServiceSpy = jasmine.createSpyObj(LetterBankService, ['getLettersInBank']);
        textBoxSpy = jasmine.createSpyObj(TextBox, ['send']);
        letterBankServiceSpy.letterBank = [];
        for (let i = 0; i < 3; i++) {
            letterBankServiceSpy.letterBank.push({ letter: 'A', quantity: 9, point: 1 });
        }
        letterServiceSpy.players = [new PlayerLetterHand(letterBankServiceSpy), new PlayerLetterHand(letterBankServiceSpy)];
        await TestBed.configureTestingModule({
            declarations: [ExchangeLettersGUIComponent],
            providers: [
                { provide: TimerTurnManagerService, useValue: timeManagerSpy },
                { provide: LetterService, useValue: letterServiceSpy },
                { provide: LetterBankService, useValue: letterBankServiceSpy },
                { provide: TextBox, useValue: textBoxSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ExchangeLettersGUIComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('isPLayerTurn should return true if turn is 0', () => {
        expect(component.isPlayerTurn()).toBeTrue();
    });

    it('areLetterSelected should return true if letters are selected', () => {
        expect(component.areLettersSelected()).toBeTrue();
    });

    it('areThereEnoughLettersInBank should return true if letters are selected', () => {
        expect(component.areThereEnoughLettersInBank()).toBeFalse();
    });
});
