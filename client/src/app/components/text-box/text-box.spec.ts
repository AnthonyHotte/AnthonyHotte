import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { TextBox } from '@app/classes/text-box-behavior';
import { MAXLETTERINHAND } from '@app/constants';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { SocketService } from '@app/services/socket.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { TextBoxComponent } from './text-box';

describe('TextBoxComponent', () => {
    let component: TextBoxComponent;
    let fixture: ComponentFixture<TextBoxComponent>;
    let textBoxServiceSpy: jasmine.SpyObj<TextBox>;
    let timeServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let socketSpy: jasmine.SpyObj<SocketService>;

    beforeEach(async () => {
        letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        socketSpy = jasmine.createSpyObj('SocketService', ['getMessageObservable', 'configureSendMessageToServer']);
        timeServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);

        const player1 = new PlayerLetterHand(letterBankServiceSpy);
        player1.allLettersInHand = [];
        for (let i = 0; i < MAXLETTERINHAND; i++) {
            player1.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
        }
        const player2 = new PlayerLetterHand(letterBankServiceSpy);
        player2.allLettersInHand = [];
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
            'getMessagesSoloOpponent',
        ]);
        component = new TextBoxComponent(textBoxServiceSpy, letterServiceSpy, socketSpy, timeServiceSpy);
        await TestBed.configureTestingModule({
            declarations: [TextBoxComponent],
            imports: [FormsModule, RouterTestingModule],
            providers: [
                { provide: TextBox, useValue: textBoxServiceSpy },
                { provide: LetterService, useValue: letterServiceSpy },
                { provide: SocketService, useValue: socketSpy },
                { provide: TimerTurnManagerService, useValue: timeServiceSpy },
            ],
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

    it('buttonDetect should call send', () => {
        component.buttonDetect();
        expect(textBoxServiceSpy.send).toHaveBeenCalled();
    });
    it('buttonDetect should call getDebugCommand', () => {
        component.buttonDetect();
        expect(textBoxServiceSpy.getDebugCommand).toHaveBeenCalled();
    });

    it('buttonDetect should call isCommand', () => {
        component.word = '!passer';
        component.buttonDetect();
        expect(textBoxServiceSpy.isCommand).toHaveBeenCalled();
    });

    it('buttonDetect should call getMessagesSoloOpponent if debug is activated', () => {
        component.word = '!passer';
        textBoxServiceSpy.getDebugCommand.and.returnValue(true);
        component.buttonDetect();
        expect(textBoxServiceSpy.getMessagesSoloOpponent).toHaveBeenCalled();
    });

    it('getInputs should call getArray', () => {
        component.getInputs();
        expect(textBoxServiceSpy.getArray).toHaveBeenCalled();
    });

    it('getSoloOpponentInputs should return the soloOpponent inputs getArray', () => {
        const soloOppMess = ['Hello', 'Bye'];
        textBoxServiceSpy.inputsSoloOpponent = soloOppMess;
        expect(component.getSoloOpponentInputs()).toEqual(soloOppMess);
    });
});
