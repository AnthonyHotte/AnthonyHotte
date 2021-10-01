import { TestBed } from '@angular/core/testing';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { FinishGameService } from '@app/services/finish-game.service';
import { TextBox } from './text-box-behavior';
import { RouterTestingModule } from '@angular/router/testing';

describe('TextBox', () => {
    let textBox: TextBox;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let soloPlayerServiceSpy: jasmine.SpyObj<SoloPlayerService>;
    let soloOpponentServiceSpy: jasmine.SpyObj<SoloOpponentService>;
    let placerLetterServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let finishGameServiceSpy: jasmine.SpyObj<FinishGameService>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        textBox = TestBed.inject(TextBox);
        letterServiceSpy = TestBed.inject(LetterService) as jasmine.SpyObj<LetterService>;
        soloPlayerServiceSpy = TestBed.inject(SoloPlayerService) as jasmine.SpyObj<SoloPlayerService>;
        soloOpponentServiceSpy = TestBed.inject(SoloOpponentService) as jasmine.SpyObj<SoloOpponentService>;
        placerLetterServiceSpy = TestBed.inject(PlaceLettersService) as jasmine.SpyObj<PlaceLettersService>;
        timerTurnManagerServiceSpy = TestBed.inject(TimerTurnManagerService) as jasmine.SpyObj<TimerTurnManagerService>;
        finishGameServiceSpy = TestBed.inject(FinishGameService) as jasmine.SpyObj<FinishGameService>;
    });

    it('should create an instance', () => {
        expect(textBox).toBeTruthy();
    });

    // missing a stub or a mock for line 28

    it('should send a word correctly', () => {
        const inputVerificationSpy = spyOn(textBox, 'inputVerification');
        // no need for both lines since logic was changed...
        // const isCommandSpy = spyOn(textBox, 'isCommand');
        const pushSpy = spyOn(textBox.inputs, 'push');
        textBox.send('Hello');
        expect(inputVerificationSpy).toHaveBeenCalledWith('Hello');
        // expect(isCommandSpy).toHaveBeenCalledWith('');
        expect(pushSpy).toHaveBeenCalledWith('Hello');
    });
    it('should validate input correctly', () => {
        textBox.inputVerification('Hello');
        expect(textBox.character).toBe(false);
    });
    it('should invalidate input correctly', () => {
        const myInvalidString =
            // we need a large string
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' +
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa';
        textBox.inputVerification(myInvalidString);
        expect(textBox.character).toBe(true);
    });
    it('should get word Hello', () => {
        textBox.word = 'Hello';
        expect(textBox.getWord()).toEqual('Hello');
    });
    it('should get inputs Hello, You, Man', () => {
        const arr = ['Hello', 'You', 'Man'];
        textBox.inputs = arr;
        for (let i = 0; i < arr.length; i++) {
            expect(textBox.getArray()[i]).toEqual(arr[i]);
        }
    });
    it('ButtonMessageState should be ButtonMessageActivated', () => {
        expect(textBox.getButtonMessageState()).toEqual('ButtonMessageActivated');
    });
    it('buttonCommandState should be ButtonCommandReleased', () => {
        expect(textBox.getButtonCommandState()).toEqual('ButtonCommandReleased');
    });
    it('should get debugCommand', () => {
        expect(textBox.getDebugCommand()).toBe(false);
    });
    it('should activate commandButton', () => {
        textBox.activateCommandButton();
        expect(textBox.buttonCommandState).toEqual('ButtonCommandActivated');
        expect(textBox.buttonMessageState).toEqual('ButtonMessageReleased');
    });
    it('should activate MessageButton', () => {
        textBox.buttonCommandState = 'ButtonCommandActivated';
        textBox.buttonMessageState = 'ButtonMessageReleased';
        textBox.activateMessageButton();
        expect(textBox.buttonCommandState).toEqual('ButtonCommandReleased');
        expect(textBox.buttonMessageState).toEqual('ButtonMessageActivated');
    });
    /*
    it('should call input.push() and command.activateDebugCommand()', () => {
       // const activateDebugCommandSpy = spyOn(textBox.debugCommand, 'activateDebugCommand');
        const pushSpy = spyOn(textBox.inputs, 'push');
        textBox.isCommand('!debug');
        expect(activateDebugCommandSpy).toHaveBeenCalled();
        expect(pushSpy).toHaveBeenCalledWith('Vous etes en mode debug');
    });
    */
    it('isCommand should call debugCommand', () => {
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        soloPlayerServiceSpy = jasmine.createSpyObj('SoloPlayerService', ['reset']);
        soloOpponentServiceSpy = jasmine.createSpyObj('SoloOpponentService', ['reset']);
        placerLetterServiceSpy = jasmine.createSpyObj('PlacerLettersService', ['placeWord']);
        timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerServiceSpy', ['endTurn']);
        finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['goToHomeAndRefresh']);

        textBox = new TextBox(
            placerLetterServiceSpy,
            soloPlayerServiceSpy,
            soloOpponentServiceSpy,
            timerTurnManagerServiceSpy,
            letterServiceSpy,
            finishGameServiceSpy,
        );

        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!debug';
        textBox.isCommand(maChaine);
        expect(textBox.debugCommand).toEqual(true);
    });
    it('isCommand should call placeWord', () => {
        const mySPy = spyOn(placerLetterServiceSpy, 'placeWord');
        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!placer';
        textBox.isCommand(maChaine);
        expect(mySPy).toHaveBeenCalled();
    });
    it('isCommand should call verifyCommandPasser', () => {
        const mySpy = spyOn(textBox, 'verifyCommandPasser');

        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!passer';
        textBox.isCommand(maChaine);
        expect(mySpy).toHaveBeenCalled();
    });
    it('isCommand should call verifyCommandExchange', () => {
        const mySpy = spyOn(textBox, 'verifyCommandEchanger');

        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!échanger';
        textBox.isCommand(maChaine);
        expect(mySpy).toHaveBeenCalled();
    });
    it('isCommand should call push', () => {
        const mySpy = spyOn(textBox.inputs, 'push');

        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!!échangsdfdsfds';
        textBox.isCommand(maChaine);
        expect(mySpy).toHaveBeenCalled();
    });
    it('sendExecuteCommand should call next', () => {
        const mySpy = spyOn(textBox.sourceMessage, 'next');

        textBox.sendExecutedCommand();
        expect(mySpy).toHaveBeenCalled();
    });
    it('verifyCommandPasser should call incrementPassedTurn', () => {
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        soloPlayerServiceSpy = jasmine.createSpyObj('SoloPlayerService', ['incrementPassedTurns']);
        soloOpponentServiceSpy = jasmine.createSpyObj('SoloOpponentService', ['reset']);
        placerLetterServiceSpy = jasmine.createSpyObj('PlacerLettersService', ['placeWord']);
        timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerServiceSpy', ['endTurn']);
        finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['goToHomeAndRefresh']);

        textBox = new TextBox(
            placerLetterServiceSpy,
            soloPlayerServiceSpy,
            soloOpponentServiceSpy,
            timerTurnManagerServiceSpy,
            letterServiceSpy,
            finishGameServiceSpy,
        );

        textBox.verifyCommandPasser();
        expect(soloPlayerServiceSpy.incrementPassedTurns).toHaveBeenCalled();
    });
    it('verifyCommandPasser should call endTurn', () => {
        const mySpy = spyOn(textBox, 'endTurn');

        textBox.valueToEndGame = 0;
        soloPlayerServiceSpy.maximumAllowedSkippedTurns = 10;
        textBox.verifyCommandPasser();
        expect(mySpy).toHaveBeenCalled();
    });
    it('verifyCommandPasser should call clear', () => {
        const mySpy = spyOn(textBox, 'finishCurrentGame');

        textBox.valueToEndGame = 10;
        soloPlayerServiceSpy.maximumAllowedSkippedTurns = 0;
        textBox.verifyCommandPasser();
        expect(mySpy).toHaveBeenCalled();
    });

    it('endTurn should call endTurn of timeManager', () => {
        const mySpy = spyOn(timerTurnManagerServiceSpy, 'endTurn');
        textBox.endTurn();
        expect(mySpy).toHaveBeenCalled();
    });
    it('endTurn should call changeTurn of opponent', () => {
        const mySpy = spyOn(soloOpponentServiceSpy, 'changeTurn');
        timerTurnManagerServiceSpy.turn = 0;
        textBox.endTurn();
        expect(mySpy).toHaveBeenCalledWith(textBox.turn.toString());
    });
    it('endTurn should call changeTurn of player', () => {
        const mySpy = spyOn(soloPlayerServiceSpy, 'changeTurn');
        timerTurnManagerServiceSpy.turn = 1;
        textBox.endTurn();
        expect(mySpy).toHaveBeenCalledWith(textBox.turn.toString());
    });
});
