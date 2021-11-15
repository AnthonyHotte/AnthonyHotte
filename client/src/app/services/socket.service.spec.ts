import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ISocketService } from './socket-wrapper.service';
import { SocketService } from './socket.service';
type CallbackSignature = (...params: unknown[]) => void;
class SocketMock implements ISocketService {
    private callbacks = new Map<string, CallbackSignature[]>();
    on(event: string, listener: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        this.callbacks.get(event)?.push(listener);
    }

    // eslint-disable-next-line no-unused-vars
    emit(_event: string, ..._params: unknown[]): void {
        return;
    }

    peerSideEmit(event: string, ...params: unknown[]) {
        if (!this.callbacks.has(event)) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        for (const callback of this.callbacks.get(event)!) {
            callback(params);
        }
    }

    disconnect(): void {
        throw new Error('Method not implemented.');
    }
}
describe('SocketService', () => {
    let service: SocketService;
    const socketMock = new SocketMock();
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
        TestBed.configureTestingModule({
            providers: [],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SocketService);
        (service.socket as unknown) = socketMock;
        service.configureBaseSocketFeatures();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('sendInitiateNewGameInformation should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.sendInitiateNewGameInformation(1, true, 'name', 1, 'name', [], [], [], [], [], false);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('sendInitiateNewGameInformation should call emit and cancelgame', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        const cancelSpy = spyOn(service, 'cancelGame');
        service.cancellationIndexes = [0, 0];
        service.sendInitiateNewGameInformation(1, true, 'name', 2, 'name', [], [], [], [], [], false);
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
    it('should enter in configureBaseRequest and call log', (done) => {
        const spys = spyOn(console, 'log').and.callThrough();
        socketMock.peerSideEmit('connect');
        expect(spys).toHaveBeenCalled();
        done();
    });

    it('handle in configureBaseRequest and call log', (done) => {
        const spys = spyOn(service.turn, 'next');
        socketMock.peerSideEmit('yourTurn');
        expect(spys).toHaveBeenCalled();
        done();
    });

    it('cancellation indexes should change cancellation indexes', (done) => {
        service.cancellationIndexes = [2, 2];
        socketMock.peerSideEmit('CancellationIndexes', [1, 0]);
        expect(service.cancellationIndexes[0]).not.toEqual(2);
        done();
    });

    it('cancellation indexes should change cancellation indexes', (done) => {
        socketMock.peerSideEmit('roomOccupied');
        expect(service.ableToJoin).toBeFalse();
        done();
    });

    it('toPlayer should call next', (done) => {
        const gameSatusSpy = spyOn(service.messageSubject, 'next');
        socketMock.peerSideEmit('toPlayer', 'allo');
        expect(gameSatusSpy).toHaveBeenCalled();
        done();
    });

    it('roomOccupied  should set to false', (done) => {
        socketMock.peerSideEmit('roomOccupied');
        expect(service.ableToJoin).toBeFalse();
        done();
    });

    it('toPlayer  should call next', (done) => {
        const mySpy = spyOn(service.messageSubject, 'next');
        socketMock.peerSideEmit('toPlayer', 'allo');
        expect(mySpy).toHaveBeenCalled();
        done();
    });

    it('receiveLettersReplaced  should set letters Replaced', (done) => {
        socketMock.peerSideEmit('receiveLettersReplaced', 'allo');
        expect(service.lettersToReplace).not.toEqual('');
        done();
    });
    /*
    it('gameIsFinished  should call next', (done) => {
        const mySpy = spyOn(service.updateOfEndGameValue, 'next');
        socketMock.peerSideEmit('gameIsFinished');
        expect(mySpy).toHaveBeenCalled();
        done();
    });
    */

    it('wordValidation  should set wordIsValid', (done) => {
        socketMock.peerSideEmit('wordValidation', true);
        expect(service.iswordvalid2).not.toBeFalse();
        done();
    });
});
