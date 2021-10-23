import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MAXLETTERINHAND } from '@app/constants';
import { MessagePlayer } from '@app/message';
import { FinishGameService } from '@app/services/finish-game.service';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { PlayerLetterHand } from './player-letter-hand';
import { TextBox } from './text-box-behavior';

fdescribe('TextBox', () => {
    let textBox: TextBox;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let placerLetterServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let finishGameServiceSpy: jasmine.SpyObj<FinishGameService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        textBox = TestBed.inject(TextBox);
        letterBankServiceSpy = TestBed.inject(LetterBankService) as jasmine.SpyObj<LetterBankService>;
        letterBankServiceSpy.letterBank = [];
        const numberLetterInBank = 13;
        for (let i = 0; i < numberLetterInBank; i++) {
            letterBankServiceSpy.letterBank.push({ letter: 'A', quantity: 9, point: 1 });
        }
        letterServiceSpy = TestBed.inject(LetterService) as jasmine.SpyObj<LetterService>;
        placerLetterServiceSpy = TestBed.inject(PlaceLettersService) as jasmine.SpyObj<PlaceLettersService>;
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
        timerTurnManagerServiceSpy = TestBed.inject(TimerTurnManagerService) as jasmine.SpyObj<TimerTurnManagerService>;
        timerTurnManagerServiceSpy.turn = 0;
        finishGameServiceSpy = TestBed.inject(FinishGameService) as jasmine.SpyObj<FinishGameService>;
    });

    it('should create an instance', () => {
        expect(textBox).toBeTruthy();
    });

    // missing a stub or a mock for line 28

    it('should send a word correctly', () => {
        const inputVerificationSpy = spyOn(textBox, 'inputVerification');
        // no need for both lines since logic was changed...
        const pushSpy = spyOn(textBox.inputs, 'push');
        const message: MessagePlayer = { message: 'test', sender: 'Systeme', role: 'Systeme' };
        textBox.send(message);
        expect(inputVerificationSpy).toHaveBeenCalledWith('test');
        expect(pushSpy).toHaveBeenCalledWith(message);
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
        textBox.inputs[0] = { message: 'test', sender: 'Systeme', role: 'Systeme' };
        expect(textBox.getArray()[0]).toEqual({ message: 'test', sender: 'Systeme', role: 'Systeme' });
    });

    it('should get inputs Hello, You, Man', () => {
        const arr: MessagePlayer[] = [
            { message: 'Hello', sender: '', role: 'Systeme' },
            { message: 'You', sender: '', role: 'Systeme' },
            { message: 'Man', sender: '', role: 'Systeme' },
        ];
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
    it('isCommand should call debugCommand', () => {
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        placerLetterServiceSpy = jasmine.createSpyObj('PlacerLettersService', ['placeWord']);
        timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerServiceSpy', ['endTurn']);
        finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['goToHomeAndRefresh']);

        textBox = new TextBox(placerLetterServiceSpy, timerTurnManagerServiceSpy, letterServiceSpy, finishGameServiceSpy, letterBankServiceSpy);

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
    // function doesn't exist anymore, can probably be removed.
    // removed for now as test are crashing and blocking other test developpement
    /* 
    it('sendExecuteCommand should call next', () => {
        const mySpy = spyOn(textBox.sourceMessage, 'next');

        textBox.sendExecutedCommand();
        expect(mySpy).toHaveBeenCalled();
    });
    */
    it('verifyCommandPasser should call incrementPassedTurn', () => {
        finishGameServiceSpy.isGameFinished = false;
        timerTurnManagerServiceSpy.turnsSkippedInARow = 100;
        textBox.verifyCommandPasser();
        expect(finishGameServiceSpy.isGameFinished).toBe(true);
    });
    it('verifyCommandPasser should call endTurn', () => {
        const mySpy = spyOn(textBox, 'endTurn');

        textBox.valueToEndGame = 0;
        textBox.verifyCommandPasser();
        expect(mySpy).toHaveBeenCalled();
    });

    it('endTurn should call endTurn of timeManager', () => {
        const mySpy = spyOn(timerTurnManagerServiceSpy, 'endTurn');
        textBox.endTurn('place');
        expect(mySpy).toHaveBeenCalled();
    });
    it('getMessageSoloOpponent should ne inputSoloOpponent', () => {
        const mySpy = textBox.getMessagesSoloOpponent();
        expect(mySpy).toBe(textBox.inputsSoloOpponent);
    });

    it('isCommand should put debug at false', () => {
        textBox.debugCommand = true;
        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!debug';
        textBox.isCommand(maChaine);
        expect(textBox.debugCommand).toBe(false);
    });
    it('send shouldn t use push', () => {
        const inputVerificationSpy = spyOn(textBox, 'inputVerification');
        // no need for both lines since logic was changed...
        const pushSpy = spyOn(textBox.inputs, 'push');
        textBox.character = true;
        textBox.send({ message: 'Hello', sender: '', role: 'Systeme' });
        expect(inputVerificationSpy).toHaveBeenCalledWith('Hello');
        expect(pushSpy).not.toHaveBeenCalled();
    });

    it('isCommand should call set false if text = mot bien placé', () => {
        timerTurnManagerServiceSpy.turn = 0;
        const mySpyPlaceWord = spyOn(placerLetterServiceSpy, 'placeWord').and.returnValue('Mot placé avec succès.');
        const mySpyEndTurn = spyOn(textBox, 'endTurn');
        const maChaine = '!placer';
        textBox.isCommand(maChaine);
        expect(mySpyPlaceWord).toHaveBeenCalled();
        expect(mySpyEndTurn).toHaveBeenCalled();
    });
    it("Can't exchange when you dont have the letters in hand", () => {
        timerTurnManagerServiceSpy.turn = 0;
        letterServiceSpy.players[timerTurnManagerServiceSpy.turn].allLettersInHand = [];
        expect(textBox.verifyCommandEchanger('!échanger a')).toEqual('Erreur! Les lettres sélectionnées ne font pas partie de la main courante.');
    });
    it('Can exchange when you have the letters in hand', () => {
        timerTurnManagerServiceSpy.turn = 0;
        letterServiceSpy.players[timerTurnManagerServiceSpy.turn].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        expect(textBox.verifyCommandEchanger('!échanger a')).toEqual('Échange de lettre avec succès.');
    });

    it("Can't exchange when there isn't enough letters in the reserve", () => {
        letterBankServiceSpy.letterBank = [];
        expect(textBox.verifyCommandEchanger('a')).toEqual('Commande impossible à réaliser! La réserve ne contient pas assez de lettres.');
    });
});
