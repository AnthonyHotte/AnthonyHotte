import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SocketService } from './socket.service';

describe('SocketService', () => {
    let service: SocketService;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SocketService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('sendInitiateNewGameInformation should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.sendInitiateNewGameInformation(1, true, 'name', 1, 'name', [], [], []);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('sendInitiateNewGameInformation should call emit and cancelgame', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        const cancelSpy = spyOn(service, 'cancelGame');
        service.cancellationIndexes = [0, 0];
        service.sendInitiateNewGameInformation(1, true, 'name', 2, 'name', [], [], []);
        expect(emitSpy).toHaveBeenCalled();
        expect(cancelSpy).toHaveBeenCalled();
    });

    it('sendJoinGameInfo should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.sendJoinGameInfo('name', 1);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('sendGameListNeededNotification should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.sendGameListNeededNotification();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('configureSendMessageToServer should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.configureSendMessageToServer('!passer', 1);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('configureSendMessageToServer should not call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.configureSendMessageToServer('!passer', 2);
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('cancelGame should not call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.cancelGame();
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('cancelGame should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.cancellationIndexes = [0, 0];
        service.cancelGame();
        expect(emitSpy).toHaveBeenCalled();
    });

    it('setAbleToJoinGame set ableToJoin to true', () => {
        service.setAbleToJoinGame();
        expect(service.ableToJoin).toBeTrue();
    });

    it('setGameMode set gameMode', () => {
        service.setGameMode(2);
        expect(service.gameMode).toEqual(2);
    });

    it('sendLetterReplaced should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.sendLetterReplaced('abc', 1);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('sendLetterReplaced should not call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.sendLetterReplaced('abc', 2);
        expect(emitSpy).not.toHaveBeenCalled();
    });

    it('finishedGameMessageTransmission should call emit and set triggeredQuit to true', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.finishedGameMessageTransmission();
        expect(emitSpy).toHaveBeenCalled();
        expect(service.triggeredQuit).toBeTrue();
    });

    it('handleDisconnect should call disconnect', () => {
        const disconnectSpy = spyOn(service.socket, 'disconnect');
        service.handleDisconnect();
        expect(disconnectSpy).toHaveBeenCalled();
    });

    it('validateWord should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.validateWord('allo');
        expect(emitSpy).toHaveBeenCalled();
    });
});
