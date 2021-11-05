import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Socket } from 'ngx-socket-io';
import { SocketService } from './socket.service';

class SocketMock extends Socket {
    private callbacks = new Map<string, CallbackSignature[]>();
    on(event: string, callback: CallbackSignature): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);
        }

        this.callbacks.get(event)?.push(callback);
    }

    emit(event: string, ...params: unknown[]): void {
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
    join(room: Room): boolean {
        return true;
    }
}
describe('SocketService', () => {
    let service: SocketService;
    let server = SocketMock;
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SocketService);
        service.socket = new SocketMock();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('sendInitiateNewGameInformation should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        service.sendInitiateNewGameInformation(1, true, 'name', 1, 'name', [], []);
        expect(emitSpy).toHaveBeenCalled();
    });

    it('sendInitiateNewGameInformation should call emit and cancelgame', () => {
        const emitSpy = spyOn(service.socket, 'emit');
        const cancelSpy = spyOn(service, 'cancelGame');
        service.cancellationIndexes = [0, 0];
        service.sendInitiateNewGameInformation(1, true, 'name', 2, 'name', [], []);
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

    it('cancelGame should call emit', () => {
        const emitSpy = spyOn(service.socket, 'emit');
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
    it('should enter in configureBaseRequest', () => {
        service.
    });
});
