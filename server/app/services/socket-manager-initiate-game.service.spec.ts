/*
// eslint-disable-next-line max-classes-per-file
import { Room } from '@app/classes/room';
import { NUMBEROFROOMS } from '@app/constants';
import { Letter } from '@app/letter';
import { Server } from '@app/server';
import { assert } from 'console';
import { spy } from 'sinon';
import * as io from 'socket.io';
import { Container } from 'typedi';
import { SocketManager } from './socket-manager-initiate-game.service';

// eslint-disable-next-line @typescript-eslint/ban-types
type CallbackSignature = (...params: unknown[]) => {};

class RoomsServiceMock {
    rooms: Room[];
    listRoomWaiting: Room[];
    indexNextRoom: number;
    constructor() {
        this.indexNextRoom = 0;
        this.rooms = [];
        this.listRoomWaiting = [];
        for (let i = 0; i < NUMBEROFROOMS; i++) {
            this.rooms.push(new Room('room number' + i, i));
        }
    }
}

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
    join(room: Room): boolean {
        return true;
    }
}

describe('Socket Manager', () => {
    let socketManager: SocketManager;
    let client;
    const socketServer = new SocketServer();
    const myLetters: Letter[] = [];
    const myLetters1: Letter[] = [];
    let roomSpy: RoomsServiceMock;

    beforeEach(async () => {
        socket = new SocketMock();
        const server: Server = Container.get(Server);
        server.init();

        // roomSpy = new RoomsServiceMock();
        // const ioSPy = new http.Server();
        // const wordValidation = new WordValidationService();
        // socketManager = new SocketManager(
        //     ioSPy as unknown as http.Server,
        //     roomSpy as unknown as RoomsService,
        //     wordValidation as unknown as WordValidationService,
        // );

        socketManager.sio = socketServer as unknown as io.Server;
    });

    it('should call cleanroom function in startingNewGameInfo', (done: Mocha.Done) => {
        roomSpy.indexNextRoom = 0;
        const spyy = spy(roomSpy.listRoomWaiting, 'push');
        for (let i = 0; i < 10; i++) {
            const l: Letter = { letter: '', quantity: 0, point: 0 };
            myLetters.push(l);
            myLetters1.push(l);
        }
        // const mySpy = spy(roomSpy.rooms[roomSpy.indexNextRoom], 'cleanRoom');
        // const mySpy1 = spy(roomSpy.rooms[roomSpy.indexNextRoom], 'setStartingInfo');
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
        // assert(mySpy.called);
        // assert(mySpy1.called);

        done();
    });
    // it('should emit startGame', () => {
    //     const mySpy = spy(socketServer.socket, 'emit');
    //     socketManager.handleSockets();
    //     socketServer.emit('connection');
    //     socketServer.socket.peerSideEmit('startingNewGameInfo', {
    //         time: 0,
    //         bonusOn: false,
    //         namePlayer: '',
    //         mode: 2,
    //         nameOpponent: '',
    //         myLetters,
    //         myLetters1,
    //     });
    //     assert(mySpy.called);
    // });
    it('should enter in the else', (done: Mocha.Done) => {
        // const mySpy = spy(roomSpy.listRoomWaiting, 'push');
        // const mySpy1 = spy(roomSpy.rooms[roomSpy.indexNextRoom], 'setStartingInfo');
        for (let i = 0; i < 2; i++) {
            const l: Letter = { letter: '', quantity: 0, point: 0 };
            myLetters.push(l);
            myLetters1.push(l);
        }
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('startingNewGameInfo', {
            time: 0,
            bonusOn: false,
            namePlayer: '',
            mode: 0,
            nameOpponent: '',
            lettersCreator: myLetters,
            lettersOpponent: myLetters1,
        });
        // assert(mySpy.called);
        // assert(mySpy1.called);

        done();
    });
    it('should enter in the else of joinGame', (done: Mocha.Done) => {
        // const roomNumber = roomSpy.listRoomWaiting[0].index;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('joinGame', {
            playerJoinName: '',
            indexInWaitingRoom: 0,
        });
        // const mySpy = spy(roomSpy.listRoomWaiting, 'push');
        done();
    });
    it('should enter in the if of joinGame', (done: Mocha.Done) => {
        for (let i = 0; i < 10; i++) {
            roomSpy.listRoomWaiting.push(new Room('room number', 0));
        }
        // roomSpy.listRoomWaiting[0].index = 0;
        roomSpy.rooms[0].roomIsAvailable = true;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('joinGame', {
            playerJoinName: '',
            indexInWaitingRoom: 0,
        });
        // const mySpy = spy(roomSpy.listRoomWaiting, 'push');
        done();
    });
    it('should enter in returnListOfGames', (done: Mocha.Done) => {
        roomSpy.rooms[0].roomIsAvailable = true;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('returnListOfGames');
        // const mySpy = spy(roomSpy.listRoomWaiting, 'push');
        done();
    });
    it('should enter in endTurn', (done: Mocha.Done) => {
        roomSpy.rooms[0].roomIsAvailable = true;
        socketManager.handleSockets();
        socketServer.emit('connection');
        const mySpy = spy(socketServer, 'emit');

        socketServer.socket.peerSideEmit('endTurn', {
            roomNumber: 0,
            turnSkipped: 0,
            playerTurnStatus: 0,
        });
        assert(mySpy.called);
        done();
    });
    it('should enter in cancelWaitingGame', (done: Mocha.Done) => {
        roomSpy.rooms[0].roomIsAvailable = true;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('cancelWaitingGame', [0]);
        // assert(mySpy.called);
        done();
    });
    it('should enter in toOpponent', (done: Mocha.Done) => {
        for (let i = 0; i < 10; i++) {
            roomSpy.listRoomWaiting.push(new Room('room number', 0));
        }
        roomSpy.rooms[0].roomIsAvailable = true;
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('toOpponent', '', 0, 0);
        // assert(mySpy.called);
        done();
    });
    it('should enter in gameFinished', (done: Mocha.Done) => {
        for (let i = 0; i < 10; i++) {
            roomSpy.rooms.push(new Room('room number', 0));
        }
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('gameFinished', 0);
        // assert(mySpy.called);
        done();
    });
    it('should enter in disconnect', (done: Mocha.Done) => {
        for (let i = 0; i < 10; i++) {
            roomSpy.rooms.push(new Room('room number', 0));
        }
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('disconnect');
        // assert(mySpy.called);
        done();
    });
    it('should enter in sendLettersReplaced', (done: Mocha.Done) => {
        for (let i = 0; i < 10; i++) {
            roomSpy.rooms.push(new Room('room number', 0));
        }
        roomSpy.rooms[0].socketsId[0] = '';
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('sendLettersReplaced');
        // assert(mySpy.called);
        done();
    });
});
*/
// with { "type": "module" } in your package.json
import { createServer } from 'http';
import { io as Client } from 'socket.io-client';
import { Server } from 'socket.io';
import { assert } from 'chai';
import { stub } from 'sinon';
import { SocketManager } from './socket-manager-initiate-game.service';
import { RoomsService } from './rooms.service';
import { WordValidationService } from './word-validation.service';

// with { "type": "commonjs" } in your package.json
// const { createServer } = require("http");
// const { Server } = require("socket.io");
// const Client = require("socket.io-client");
// const assert = require("chai").assert;

describe('my awesome project', () => {
    let io: Server;
    let serverSocket: SocketManager;
    let clientSocket: unknown;
    let roomStub: RoomsService;
    let wordStub: WordValidationService;
    before((done) => {
        roomStub = stub(RoomsService) as unknown as RoomsService;
        wordStub = stub(WordValidationService) as unknown as WordValidationService;
        const httpServer = createServer();
        serverSocket = new SocketManager(httpServer, roomStub, wordStub) as SocketManager;
        io = new Server(httpServer);
        httpServer.listen(() => {
            // const port = httpServer.address().port;
            clientSocket = Client('http://localhost:3000');
            // clientSocket = new Client(`http://localhost:${port}`);
            io.on('connection', (socket) => {
                serverSocket = socket;
            });
            clientSocket.on('connect', done);
        });
        serverSocket.sio = io;
    });

    after(() => {
        io.close();
        clientSocket.close();
    });

    it('should work', (done) => {
        clientSocket.on('hello', (arg) => {
            assert.equal(arg, 'world');
            done();
        });
        serverSocket.emit('hello', 'world');
    });

    it('should work (with ack)', (done) => {
        serverSocket.on('hi', (cb) => {
            cb('hola');
        });
        clientSocket.emit('hi', (arg) => {
            assert.equal(arg, 'hola');
            done();
        });
    });
});
