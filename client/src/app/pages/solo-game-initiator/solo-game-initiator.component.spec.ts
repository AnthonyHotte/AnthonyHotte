import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND } from '@app/constants';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { SocketService } from '@app/services/socket.service';
import { TileScramblerService } from '@app/services/tile-scrambler.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { SoloGameInitiatorComponent } from './solo-game-initiator.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MessageService } from '@app/services/message.service';
import { MatDialog } from '@angular/material/dialog';
import { IndexWaitingRoomService } from '@app/services/index-waiting-room.service';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { Observable } from 'rxjs';
import { SoloOpponent2Service } from '@app/services/solo-opponent2.service';

describe('SoloGameInitiatorComponent', () => {
    let component: SoloGameInitiatorComponent;
    let fixture: ComponentFixture<SoloGameInitiatorComponent>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let tileScramblerServiceSpy: jasmine.SpyObj<TileScramblerService>;
    let timerTurnManagerServiceSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let messageServiceSpy: jasmine.SpyObj<MessageService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let dialogSpy: jasmine.SpyObj<MatDialog>;
    let indexWaintingRoomService: jasmine.SpyObj<IndexWaitingRoomService>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;
    let soloopponent2Spy: jasmine.SpyObj<SoloOpponent2Service>;
    beforeEach(async () => {
        soloopponent2Spy = jasmine.createSpyObj('SoloOpponent2Service', ['play']);
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getDictionaryList']);
        communicationServiceSpy.getDictionaryList.and.returnValue(new Observable());
        indexWaintingRoomService = jasmine.createSpyObj('IndexWaitingRoomService', ['getIndex']);
        indexWaintingRoomService.getIndex.and.returnValue(0);
        messageServiceSpy = jasmine.createSpyObj('MessageService', ['gameStartingInfoSubscribe']);
        letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
        socketServiceSpy = jasmine.createSpyObj('SocketService', ['sendJoinGameInfo', 'setGameMode', 'sendInitiateNewGameInformation']);
        socketServiceSpy.nameOfRoomCreator = 'Tony';
        socketServiceSpy.gameLists = [];
        socketServiceSpy.gameLists.push(['name', 'false', '30', 'abc', 'def']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
        dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
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
        tileScramblerServiceSpy = jasmine.createSpyObj('TileScramblerService', ['scrambleTiles']);
        timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
        timerTurnManagerServiceSpy.turn = 0;
        await TestBed.configureTestingModule({
            declarations: [SoloGameInitiatorComponent],
            providers: [
                { provide: SoloOpponent2Service, useValue: soloopponent2Spy },
                { provide: MessageService, useValue: messageServiceSpy },
                { provide: SocketService, useValue: socketServiceSpy },
                { provide: LetterService, useValue: letterServiceSpy },
                { provide: TileScramblerService, useValue: tileScramblerServiceSpy },
                { provide: TimerTurnManagerService, useValue: timerTurnManagerServiceSpy },
                { provide: MatDialog, useValue: dialogSpy },
                { provide: IndexWaitingRoomService, useValue: indexWaintingRoomService },
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: DictionaryService, useValue: dictionaryServiceSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloGameInitiatorComponent);
        component = fixture.componentInstance;
        component.nameIsValid = true;
        component.opponentName = 'Tony';
        component.idNameOpponent = 0;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('join game should call set name', () => {
        const spy = spyOn(component, 'setName');
        component.joinGame();
        expect(spy).toHaveBeenCalled();
    });
    it('sendNewGameStartInfo should call sendInitiateNewGameInformation', () => {
        component.sendNewGameStartInfo();
        expect(socketServiceSpy.sendInitiateNewGameInformation).toHaveBeenCalled();
    });
    it('verifyName should put nameIsValid to false', () => {
        const spyStatus = spyOn(component, 'getGameStatus').and.returnValue(1);
        const spyVerifName = spyOn(component, 'verifyNameIsNotSameAsRoomCreator').and.returnValue(false);
        component.verifyNames();
        expect(spyStatus).toHaveBeenCalled();
        expect(spyVerifName).toHaveBeenCalled();
        expect(component.nameIsValid).toBe(false);
    });
    it('setRandomBonus should set random bonus', () => {
        component.isBonusRandom = false;
        component.setRandomBonus(true);
        expect(component.isBonusRandom).toBe(true);
    });
    it('scrambleBonus should call scrambleTiles', () => {
        component.isBonusRandom = true;
        component.scrambleBonus();
        expect(tileScramblerServiceSpy.scrambleTiles).toHaveBeenCalled();
    });
    it('startNewGame should put start new game to true', () => {
        component.startingNewGame = false;
        const spy = spyOn(component, 'sendNewGameStartInfo');
        component.startNewGame();
        expect(spy).toHaveBeenCalled();
        expect(component.startingNewGame).toBe(true);
    });
    it('getGameStatusInString should return solo', () => {
        timerTurnManagerServiceSpy.gameStatus = 2;
        const res = component.getGameStatusInString();
        expect(res).toEqual('solo');
    });
    it('createPopUp should call open', () => {
        component.createPopUp();
        expect(dialogSpy.open).toHaveBeenCalled();
    });
    it('returnNameOfCreator should return the name', () => {
        socketServiceSpy.nameOfRoomCreator = 'antho';
        const res = component.returnNameOfCreator();
        expect(res).toEqual('antho');
    });

    it('verifyName should call assignOpponentName', () => {
        const mySpy2 = spyOn(component, 'assignOpponentName');
        const mySpy3 = spyOn(component, 'switchOpponentName');
        component.verifyNames();
        expect(mySpy2).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
    });
    it('verifyName should set nameIsValid at false', () => {
        component.temporaryName = 'sdfsdfsdfsdfsdfsdfsdfsdfsdsfsdfsdfsdfdsfdsfsdfsdfsdfsdfsdfsdf';
        component.verifyNames();
        expect(component.nameIsValid).toBe(false);
    });
    it('verifyName should set nameIsValid at true', () => {
        component.temporaryName = 'sdfsd';
        component.verifyNames();
        expect(component.nameIsValid).toBe(true);
    });
    it('verifyName should set nameIsValid at false in the else', () => {
        component.temporaryName = 'sdfsd123';
        component.verifyNames();
        expect(component.nameIsValid).toBe(false);
    });
    it('setName should put this.temporaryname in this.name', () => {
        component.temporaryName = 'sdfsd';
        component.setName();
        expect(component.name).toBe(component.temporaryName);
    });
    it('setName should put joueur in this.name', () => {
        component.temporaryName = 'sdfsd3';
        component.setName();
        const j = 'Joueur';
        expect(component.name).toBe(j);
    });
    it('nameValidity should return valide ', () => {
        component.nameIsValid = true;
        const retour = component.nameValidityInChar();
        const val = 'valide';
        expect(retour).toBe(val);
    });
    it('nameValidity should return invalide ', () => {
        component.nameIsValid = false;
        const retour = component.nameValidityInChar();
        const val = 'invalide';
        expect(retour).toBe(val);
    });
    it('switchOpponentName should enter in case 1', () => {
        component.opponentName = 'abcd';
        const temp = 'abcd';
        component.idNameOpponent = 1;
        const retour = 'Daphne du Maurier';
        component.switchOpponentName(temp);
        expect(component.opponentName).toBe(retour);
    });
    it('switchOpponentName should enter in case 2', () => {
        component.opponentName = 'abcd';
        const temp = 'abcd';
        component.idNameOpponent = 2;
        const retour = 'Jane Austen';
        component.switchOpponentName(temp);
        expect(component.opponentName).toBe(retour);
    });
    it('switchOpponentName should enter in default', () => {
        component.opponentName = 'abcd';
        const temp = 'abcd';
        component.idNameOpponent = 3;
        const retour = 'Haruki Murakami';
        component.switchOpponentName(temp);
        expect(component.opponentName).toBe(retour);
    });
});
