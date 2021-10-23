import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { TextBox } from '@app/classes/text-box-behavior';
import { MAXLETTERINHAND } from '@app/constants';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
// import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { TextBoxComponent } from './text-box';

describe('TextBoxComponent', () => {
    let component: TextBoxComponent;
    let fixture: ComponentFixture<TextBoxComponent>;
    let textBoxServiceSpy: jasmine.SpyObj<TextBox>;
    // let timeServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;

    beforeEach(async () => {
        letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        const player1 = new PlayerLetterHand(letterBankServiceSpy);
        for (let i = 0; i < MAXLETTERINHAND; i++) {
            player1.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
        }
        const player2 = new PlayerLetterHand(letterBankServiceSpy);
        for (let i = 0; i < MAXLETTERINHAND; i++) {
            player2.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
        }
        letterServiceSpy.players = [player1, player2];
        textBoxServiceSpy = jasmine.createSpyObj('TextBox', [
            'activateCommandButton',
            'activateMessageButton',
            'send',
            'getArray',
            'getWord',
            'getDebugCommand',
            'isCommand',
        ]);
        component = new TextBoxComponent(textBoxServiceSpy, letterServiceSpy);
        await TestBed.configureTestingModule({
            declarations: [TextBoxComponent],
            imports: [FormsModule, RouterTestingModule],
            providers: [
                { provide: TextBox, useValue: textBoxServiceSpy },
                { provide: LetterService, useValue: letterServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TextBoxComponent);
        component = fixture.componentInstance;
        component.message = { message: '', sender: letterServiceSpy.players[0].name, role: 'Joueur' };
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should activate message, desactivate command and call activateMessageButton', () => {
        component.activateMessage();
        expect(component.buttonCommandState).toBe('ButtonCommandReleased');
        expect(component.buttonMessageState).toBe('ButtonMessageActivated');
        expect(textBoxServiceSpy.activateMessageButton).toHaveBeenCalled();
    });
    it('should desactivate message, activate command and call activateCommandButton', () => {
        component.activateCommand();
        expect(component.buttonCommandState).toBe('ButtonCommandActivated');
        expect(component.buttonMessageState).toBe('ButtonMessageReleased');
        expect(textBoxServiceSpy.activateCommandButton).toHaveBeenCalled();
    });
    it('buttonDetect should call send', () => {
        component.buttonDetect();
        expect(textBoxServiceSpy.send).toHaveBeenCalled();
    });
    it('buttonDetect should call getDebugCommand', () => {
        component.buttonDetect();
        expect(textBoxServiceSpy.getDebugCommand).toHaveBeenCalled();
    });
    it('buttonDetect should call isCommand', () => {
        component.buttonCommandState = 'ButtonCommandActivated';
        component.buttonDetect();
        expect(textBoxServiceSpy.isCommand).toHaveBeenCalled();
    });
    it('buttonDetect should not call isCommand', () => {
        component.buttonCommandState = 'ButtonCommandReleased';
        component.buttonDetect();
        expect(textBoxServiceSpy.isCommand).not.toHaveBeenCalled();
    });
});
