import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TextBox } from '@app/classes/text-box-behavior';
import { LetterService } from '@app/services/letter.service';
// import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { TextBoxComponent } from './text-box';

describe('TextBoxComponent', () => {
    let component: TextBoxComponent;
    let fixture: ComponentFixture<TextBoxComponent>;
    let textBoxServiceSpy: jasmine.SpyObj<TextBox>;
    // let timeServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;

    beforeEach(async () => {
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
            providers: [{ provide: TextBox, useValue: textBoxServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(TextBoxComponent);
        component = fixture.componentInstance;
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
