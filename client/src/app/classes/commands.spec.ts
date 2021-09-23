import { TestBed } from '@angular/core/testing';
import { Commands } from './commands';
describe('Commands', () => {
    let commands: Commands;

    beforeEach(() => {
        commands = TestBed.inject(Commands);
    });
    it('should create an instance', () => {
        expect(commands).toBeTruthy();
    });
    it('should activate the debug command', () => {
        commands.activateDebugCommand();
        expect(commands.debugCommand).toBe(true);
    });
    /*
    it('should create an instance', () => {
        const activateDebugCommandSpy = spyOn(commands, 'activateDebugCommand').and.callThrough();
        commands.chooseCommands('!debug');
        expect(activateDebugCommandSpy).toHaveBeenCalled();
    });
    */
});
