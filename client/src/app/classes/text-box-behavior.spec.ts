import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TextBox } from './text-box-behavior';

describe('TextBox', () => {
    let textBox: TextBox;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });
        textBox = TestBed.inject(TextBox);
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
});
