// eslint-disable-next-line max-classes-per-file
import * as http from 'http';
import { createStubInstance } from 'sinon';
import * as io from 'socket.io';
import { RoomsService } from './rooms.service';
import { SocketManager } from './socket-manager-initiate-game.service';
import { WordValidationService } from './word-validation.service';
// eslint-disable-next-line @typescript-eslint/ban-types
type CallbackSignature = (...params: unknown[]) => {};

class SocketServer {
    socket = new SocketMock();
    private callbacks = new Map<string, [SocketMock, CallbackSignature]>();
    on(event: string, callback: CallbackSignature): void {
        this.callbacks.set(event, [this.socket, callback]);
    }

    emit(event: string, ...params: unknown[]): void {
        const tuple = this.callbacks.get(event) as [SocketMock, CallbackSignature];
        tuple[1](tuple[0]);
    }
}

class SocketMock {
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
}

describe.only('Socket Manager', () => {
    let socketManager: SocketManager;
    const socketServer = new SocketServer();

    beforeEach(async () => {
        const ioSPy = new http.Server();
        const roomSpy = new RoomsService();
        const wordValidation = createStubInstance(WordValidationService);
        socketManager = new SocketManager(
            ioSPy as unknown as http.Server,
            roomSpy as unknown as RoomsService,
            wordValidation as unknown as WordValidationService,
        );

        socketManager.sio = socketServer as unknown as io.Server;
        socketManager.handleSockets();
    });

    it('should call on with stating with new game info', () => {
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('toServer', null);
    });
});
