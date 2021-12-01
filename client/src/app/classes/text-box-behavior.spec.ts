import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
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
describe('TextBox', () => {
    let textBox: TextBox;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let placerLetterServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let finishGameServiceSpy: jasmine.SpyObj<FinishGameService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let routerSpy: jasmine.SpyObj<Router>;
    beforeEach(async () => {
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
        letterBankServiceSpy.letterBank = [];
        const numberLetterInBank = 13;
        for (let i = 0; i < numberLetterInBank; i++) {
            letterBankServiceSpy.letterBank.push({ letter: 'A', quantity: 9, point: 1 });
        }
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        placerLetterServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['verifyTileNotOutOfBound', 'placeWord']);
        letterServiceSpy.players = [];
        letterServiceSpy.players.push(new PlayerLetterHand(letterBankServiceSpy));
        letterServiceSpy.players.push(new PlayerLetterHand(letterBankServiceSpy));
        letterServiceSpy.players[0].allLettersInHand = [];
        for (let i = 0; i < MAXLETTERINHAND; i++) {
            letterServiceSpy.players[0].allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
        }
        letterServiceSpy.players[0].name = 'tony';
        letterServiceSpy.players[1].name = 'tony';
        letterServiceSpy.players[1].allLettersInHand = [];
        for (let i = 0; i < MAXLETTERINHAND; i++) {
            letterServiceSpy.players[1].allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
        }
        timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
        timerTurnManagerServiceSpy.turn = 0;
        finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['scoreCalculator', 'goToHomeAndRefresh']);
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule, HttpClientTestingModule],
            providers: [
                { provide: PlaceLettersService, useValue: placerLetterServiceSpy },
                { provide: LetterService, useValue: letterServiceSpy },
                { provide: LetterBankService, useValue: letterBankServiceSpy },
                { provide: TimerTurnManagerService, useValue: timerTurnManagerServiceSpy },
                { provide: FinishGameService, useValue: finishGameServiceSpy },
                { provide: Router, useValue: routerSpy },
            ],
        }).compileComponents();
    });
    beforeEach(() => {
        TestBed.configureTestingModule({});
        textBox = TestBed.inject(TextBox);
    });
    it('should create an instance', () => {
        expect(textBox).toBeTruthy();
    });
    it('should send a word correctly', () => {
        const pushSpy = spyOn(textBox.inputs, 'push');
        const message: MessagePlayer = { message: ' testwithastringtolongwithaspaceatbeginning', sender: 'Systeme', role: 'Systeme' };
        textBox.send(message);
        expect(pushSpy).toHaveBeenCalledWith(message);
    });
    it('should validate input correctly', () => {
        textBox.inputVerification('Hello');
        expect(textBox.character).toBe(false);
    });
    it('should invalidate input correctly', () => {
        const myInvalidString =
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
    it('should get debugCommand', () => {
        expect(textBox.getDebugCommand()).toBe(false);
    });
    it('isCommand should call debugCommand', () => {
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        placerLetterServiceSpy = jasmine.createSpyObj('PlacerLettersService', ['placeWord']);
        timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerServiceSpy', ['endTurn']);
        finishGameServiceSpy = jasmine.createSpyObj('FinishGameService', ['goToHomeAndRefresh']);
        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!debug';
        textBox.isCommand(maChaine);
        expect(textBox.debugCommand).toEqual(true);
    });
    it('isCommand should call placeWord', () => {
        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!placer';
        textBox.isCommand(maChaine);
        expect(placerLetterServiceSpy.placeWord).toHaveBeenCalled();
    });
    it('isCommand should call handleEnter', () => {
        const spy = spyOn(textBox, 'handleEnter');
        const maChaine = '!aide';
        textBox.isCommand(maChaine);
        expect(spy).toHaveBeenCalled();
    });
    it('isCommand should call goToHomeAndRefresh', () => {
        textBox.isCommand('!abandonner');
        expect(finishGameServiceSpy.goToHomeAndRefresh).toHaveBeenCalled();
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
    it('isCommand should call handleEnter when input is !réserve', () => {
        const mySPy = spyOn(textBox, 'handleEnter');
        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!réserve';
        textBox.isCommand(maChaine);
        expect(mySPy).toHaveBeenCalled();
    });
    it('isCommand should call push', () => {
        const mySpy = spyOn(textBox.inputs, 'push');

        timerTurnManagerServiceSpy.turn = 0;
        const maChaine = '!!échangsdfdsfds';
        textBox.isCommand(maChaine);
        expect(mySpy).toHaveBeenCalled();
    });
    it('verifyCommandPasser should call incrementPassedTurn', () => {
        finishGameServiceSpy.isGameFinished = false;
        timerTurnManagerServiceSpy.turnsSkippedInARow = 100;
        textBox.verifyCommandPasser();
        expect(finishGameServiceSpy.isGameFinished).toBe(true);
    });
    it('verifyCommandPasser should call endTurn', () => {
        const mySpy = spyOn(textBox, 'endTurn');
        timerTurnManagerServiceSpy.turnsSkippedInARow = 0;
        textBox.valueToEndGame = 0;
        textBox.verifyCommandPasser();
        expect(mySpy).toHaveBeenCalled();
    });
    it('endTurn should call endTurn of timeManager', () => {
        textBox.endTurn('place');
        expect(timerTurnManagerServiceSpy.endTurn).toHaveBeenCalled();
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
    it('isCommand should call set false if text = mot bien placé', async () => {
        const promise1 = new Promise<string>((resolve) => {
            resolve('Mot placé avec succès.');
        });
        timerTurnManagerServiceSpy.turn = 0;
        placerLetterServiceSpy.placeWord.and.returnValue(promise1);
        const mySpyEndTurn = spyOn(textBox, 'endTurn');
        const maChaine = '!placer';
        await textBox.isCommand(maChaine);

        expect(placerLetterServiceSpy.placeWord).toHaveBeenCalled();
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
    it("placeWordOpponent should call verifyCommanPasser if place word doesn't return Mot placé avec succès.", async () => {
        const promise1 = new Promise<string>((resolve) => {
            resolve('allo');
        });
        placerLetterServiceSpy.placeWord.and.returnValue(promise1);
        const mySpy = spyOn(textBox, 'verifyCommandPasser');
        await textBox.placeWordOpponent('!placer h8h allo', 'abcd');
        expect(mySpy).toHaveBeenCalled();
    });
    it('placeWordOpponent should call endTurn if place word returns Mot placé avec succès.', async () => {
        const promise1 = new Promise<string>((resolve) => {
            resolve('Mot placé avec succès.');
        });
        placerLetterServiceSpy.placeWord.and.returnValue(promise1);
        const mySpy = spyOn(textBox, 'endTurn');
        await textBox.placeWordOpponent('!placer h8h allo', 'abcd');
        expect(mySpy).toHaveBeenCalled();
    });
    it('exchangeLetterOpponent return the name of opponent and the amount of letters exchanged when he does successful exchange', () => {
        letterServiceSpy.players[1].name = 'Opp';
        spyOn(textBox, 'verifyCommandEchanger').and.returnValue('Échange de lettre avec succès.');
        const command = '!échanger allo';
        const expectedResult = 'Opp a échangé 4 lettres';
        expect(textBox.exchangeLetterOpponent(command)).toEqual(expectedResult);
    });
    it('exchangeLetterOpponent return empty string if exchange is not successful', () => {
        letterServiceSpy.players[1].name = 'Opp';
        spyOn(textBox, 'verifyCommandEchanger').and.returnValue('Erreur! Les lettres sélectionnées ne font pas partie de la main courante.');
        const lettersExch = 'allo';
        expect(textBox.exchangeLetterOpponent(lettersExch)).toEqual('');
    });
    it('handleEnter should call push for every time there is a skip line in the string passed to it', () => {
        const input = 'pls \n give 100% \n';
        const mySpy = spyOn(textBox.inputs, 'push');
        textBox.handleEnter(input);
        expect(mySpy).toHaveBeenCalledTimes(2);
    });
    it('handleEnter should call push for evry time there is a skipline in the string passd and 1more time if theinput doesnt finish withskip', () => {
        const input = 'pls \n give \n 100%';
        const mySpy = spyOn(textBox.inputs, 'push');
        textBox.handleEnter(input);
        expect(mySpy).toHaveBeenCalledTimes(3);
    });
    it('endturn should set isgamefinished to true if player hand is empty', () => {
        letterServiceSpy.players[0].allLettersInHand = [];
        finishGameServiceSpy.isGameFinished = false;
        timerTurnManagerServiceSpy.turn = 0;
        textBox.endTurn('place');
        expect(finishGameServiceSpy.isGameFinished).toBeTrue();
    });
    it('Can exchange when you have the letters in hand and there is preset letters to chose from letterbank', () => {
        timerTurnManagerServiceSpy.turn = 0;
        letterServiceSpy.players[timerTurnManagerServiceSpy.turn].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        expect(textBox.verifyCommandEchanger('!échanger a', 'a')).toEqual('Échange de lettre avec succès.');
    });

    it('handleOpponentCommand should call verifyCommandPasser when the the command is !passer', async () => {
        spyOn(textBox.inputs, 'push');
        const mySpy = spyOn(textBox, 'verifyCommandPasser');
        await textBox.handleOpponentCommand('!passer');
        expect(mySpy).toHaveBeenCalled();
    });

    it('handleOpponentCommand should call exchangeLetterOpponent when the the command is !échanger', async () => {
        spyOn(textBox.inputs, 'push');
        const mySpy = spyOn(textBox, 'exchangeLetterOpponent');
        await textBox.handleOpponentCommand('!échanger abc');
        expect(mySpy).toHaveBeenCalled();
    });
    it('handleOpponentCommand should call exchangeLetterOpponent when the the command is !échanger when tur equal 1', async () => {
        const mySpy = spyOn(textBox.inputs, 'push');
        timerTurnManagerServiceSpy.turn = 1;
        letterServiceSpy.players[0].name = 'Tryphon Tournesol';
        await textBox.handleOpponentCommand('!abandonner');
        expect(mySpy).toHaveBeenCalled();
    });
    it('verifyAide should return right message', async () => {
        const expected =
            'Voici les commandes disponibles : \n!passer : permet de passer son tour. \n' +
            "!échanger : permet d'échanger des lettres. \n !réserve : Permet d'afficher sa réserve. \n " +
            '!placer : permet de placer des lettres sur le plateau. \n ' +
            "!abandonner : permet d'abandonner la partie.";
        const res = textBox.verifyAide();
        expect(res).toEqual(expected);
    });
    it('handleOpponentCommand should call exchangeLetterOpponent when the the command is !échanger', async () => {
        const mySpy = spyOn(textBox.inputs, 'push');
        await textBox.handleOpponentCommand('!abandonner');
        expect(mySpy).toHaveBeenCalled();
    });
    it('handleOpponentCommand should call exchangeLetterOpponent when the the command is !aide', async () => {
        const mySpy = spyOn(textBox.inputs, 'push');
        await textBox.handleOpponentCommand('!aide');
        expect(mySpy).toHaveBeenCalled();
    });
    it('handleOpponentCommand should push something in inputs when the the command is !réserve', async () => {
        const mySpy = spyOn(textBox.inputs, 'push');
        await textBox.handleOpponentCommand('!réserve');
        expect(mySpy).toHaveBeenCalled();
    });
    it('handleOpponentCommand should call placeWordOpponent when the the command is !placer', async () => {
        spyOn(textBox.inputs, 'push');
        const mySpy = spyOn(textBox, 'placeWordOpponent');
        await textBox.handleOpponentCommand('!placer h8h abc');
        expect(mySpy).toHaveBeenCalled();
    });
});
