/* eslint-disable max-classes-per-file */
// // eslint-disable-next-line max-classes-per-file
// import { Room } from '@app/classes/room';
// import { NUMBEROFROOMS } from '@app/constants';
import { Room } from '@app/classes/room';
import { NUMBEROFROOMS } from '@app/constants';
import { Letter } from '@app/letter';
import { assert } from 'console';
import * as http from 'http';
import { spy, stub } from 'sinon';
import * as io from 'socket.io';
import { DictionaryService } from './dictionary.service';
import { RoomsService } from './rooms.service';
import { SocketManager } from './socket-manager-initiate-game.service';
import { WordValidationService } from './word-validation.service';

// eslint-disable-next-line @typescript-eslint/ban-types
// eslint-disable-next-line @typescript-eslint/no-explicit-any
// eslint-disable-next-line @typescript-eslint/ban-types
type CallbackSignature = (...params: unknown[]) => {};

class SocketServer {
    socket = new SocketMock();
    private callbacks = new Map<string, [SocketMock, CallbackSignature]>();
    on(event: string, callback: CallbackSignature): void {
        this.callbacks.set(event, [this.socket, callback]);
    }

    // eslint-disable-next-line no-unused-vars
    emit(event: string, ...params: unknown[]): void {
        const tuple = this.callbacks.get(event) as [SocketMock, CallbackSignature];
        tuple[1](tuple[0]);
    }
    // eslint-disable-next-line no-unused-vars
    to(...args: unknown[]): SocketServer {
        return new SocketServer();
    }
}

class SocketMock {
    id: string = 'Socket mock';
    events: Map<string, CallableFunction> = new Map();
    // eslint-disable-next-line no-unused-vars
    emit(event: string, ...params: unknown[]): void {
        return;
    }

    on(eventName: string, cb: CallableFunction) {
        this.events.set(eventName, cb);
    }

    peerSideEmit(eventName: string, ...args: unknown[]) {
        const arrowFunction = this.events.get(eventName) as CallableFunction;
        arrowFunction(...args);
    }

    // eslint-disable-next-line no-unused-vars
    join(...args: unknown[]) {
        return;
    }

    // eslint-disable-next-line no-unused-vars
    leave(...args: unknown[]) {
        return;
    }

    disconnect() {
        return;
    }
}

describe('Socket Manager', () => {
    let socketManager: SocketManager;
    const socketServer = new SocketServer();
    const myLetters: Letter[] = [];
    const myLetters1: Letter[] = [];
    let roomSpy: RoomsService;
    let dico: DictionaryService;
    const TEN = 10;

    beforeEach(() => {
        dico = new DictionaryService();
        roomSpy = new RoomsService();
        roomSpy.indexNextRoom = 0;
        roomSpy.rooms = [];
        roomSpy.listRoomWaiting = [];
        for (let i = 0; i < NUMBEROFROOMS; i++) {
            roomSpy.rooms.push(new Room('room number' + i, i));
        }
        const ioSPy = new http.Server();
        const wordValidation = new WordValidationService(dico);
        socketManager = new SocketManager(
            ioSPy as unknown as http.Server,
            roomSpy as unknown as RoomsService,
            wordValidation as unknown as WordValidationService,
        );

        socketManager.roomsService.rooms[0] = new Room('room number', 0);
        socketManager.roomsService.rooms[0].playerNames = ['', ''];
        socketManager.roomsService.rooms[0].socketsId = ['', ''];
        for (let i = 0; i < TEN; i++) {
            const l: Letter = { letter: '', quantity: 0, point: 0 };
            myLetters.push(l);
            myLetters1.push(l);
        }
        socketManager.roomsService.listRoomWaiting = [];
        for (let i = 0; i < NUMBEROFROOMS; i++) {
            stub(socketManager.roomsService.rooms[i], 'setStartingInfo');
        }
        socketManager.sio = socketServer as unknown as io.Server;
        socketManager.roomsService.rooms[0].playerNames[0] = 'ed';
    });

    it('should call cleanroom function in startingNewGameInfo', () => {
        socketManager.roomsService.indexNextRoom = 0;
        const spyy = spy(roomSpy.listRoomWaiting, 'push');
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('startingNewGameInfo', {
            time: 0,
            bonusOn: false,
            namePlayer: '',
            mode: 2,
            nameOpponent: '',
            letter: myLetters,
            lettersOpponent: myLetters1,
        });
        assert(spyy.called);
    });

    it('should emit startGame', () => {
        const mySpy = spy(socketServer.socket, 'emit');
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('startingNewGameInfo', {
            time: 0,
            bonusOn: false,
            namePlayer: '',
            mode: 2,
            nameOpponent: '',
            myLetters,
            myLetters1,
        });
        assert(mySpy.called);
    });
    it('should enter in the else of statingNewInfo', () => {
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('startingNewGameInfo', {
            time: 0,
            bonusOn: false,
            namePlayer: '',
            mode: 0,
            nameOpponent: '',
            myLetters,
            myLetters1,
        });
    });
    it('should enter in the else of joinGame', () => {
        socketManager.roomsService.listRoomWaiting = [];
        socketManager.roomsService.rooms[0].roomIsAvailable = false;
        for (let i = 0; i < TEN; i++) {
            socketManager.roomsService.listRoomWaiting.push(new Room('room number', 0));
        }
        socketManager.roomsService.listRoomWaiting[0].index = 0;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('joinGame', {
            playerJoinName: '',
            indexInWaitingRoom: 0,
        });
    });
    it('should enter in the 3rd if of joinGame', () => {
        socketManager.roomsService.listRoomWaiting = [];
        socketManager.roomsService.rooms[0].roomIsAvailable = false;
        for (let i = 0; i < TEN; i++) {
            socketManager.roomsService.listRoomWaiting.push(new Room('room number', 0));
        }
        socketManager.roomsService.listRoomWaiting[0].index = 0;
        socketManager.roomsService.rooms[0].playerNames[0] = 'ed';
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('joinGame', {
            playerJoinName: '',
            indexInWaitingRoom: 0,
        });
    });
    it('should enter in the 3rd else of joinGame', () => {
        socketManager.roomsService.listRoomWaiting = [];
        socketManager.roomsService.rooms[0].roomIsAvailable = false;
        for (let i = 0; i < TEN; i++) {
            socketManager.roomsService.listRoomWaiting.push(new Room('room number', 0));
        }
        socketManager.roomsService.listRoomWaiting[0].index = 0;
        socketManager.roomsService.rooms[0].playerNames[0] = '';
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('joinGame', {
            playerJoinName: 'sadas',
            indexInWaitingRoom: 0,
        });
    });
    it('should enter in the if of joinGame', () => {
        for (let i = 0; i < TEN; i++) {
            socketManager.roomsService.listRoomWaiting.push(new Room('room number', 0));
        }
        socketManager.roomsService.listRoomWaiting[0].index = 0;
        socketManager.roomsService.rooms[0].roomIsAvailable = true;
        socketManager.roomsService.rooms[0].playerNames = ['', ''];
        socketManager.roomsService.rooms[0].socketsId = ['', ''];
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('joinGame', {
            playerJoinName: '',
            indexInWaitingRoom: 0,
        });
    });
    it('should enter in returnListOfGames', () => {
        for (let i = 0; i < TEN; i++) {
            socketManager.roomsService.listRoomWaiting.push(new Room('room number', 0));
        }
        socketManager.roomsService.listRoomWaiting[0].index = 0;
        socketManager.roomsService.rooms[0].roomIsAvailable = false;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('returnListOfGames');
    });
    it('should enter in the else of returnListOfGames', () => {
        for (let i = 0; i < TEN; i++) {
            socketManager.roomsService.listRoomWaiting.push(new Room('room number', 0));
        }
        socketManager.roomsService.listRoomWaiting[0].index = 0;
        socketManager.roomsService.listRoomWaiting[0].roomIsAvailable = false;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('returnListOfGames');
    });

    it('should enter in cancelWaitingGame', () => {
        roomSpy.rooms[0].roomIsAvailable = true;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('cancelWaitingGame', [0]);
    });
    it('should enter in validateWordOnServer', () => {
        socketServer.socket.peerSideEmit('cancelWaitingGame', [0]);
    });
    it('should enter in gameFinished', () => {
        for (let i = 0; i < TEN; i++) {
            socketManager.roomsService.listRoomWaiting.push(new Room('room number', 0));
        }
        socketManager.roomsService.listRoomWaiting[0].roomIsAvailable = false;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('gameFinished', 0);
    });
    it('should enter in disconnect', () => {
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('disconnect');
    });
});
