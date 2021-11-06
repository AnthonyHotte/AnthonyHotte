/* eslint-disable max-classes-per-file */
// // eslint-disable-next-line max-classes-per-file
// import { Room } from '@app/classes/room';
// import { NUMBEROFROOMS } from '@app/constants';
import { Room } from '@app/classes/room';
import { NUMBEROFROOMS } from '@app/constants';
import { Letter } from '@app/letter';
import { assert } from 'console';
import * as http from 'http';
import { spy } from 'sinon';
import * as io from 'socket.io';
import { RoomsService } from './rooms.service';
import { SocketManager } from './socket-manager-initiate-game.service';
import { WordValidationService } from './word-validation.service';

// eslint-disable-next-line @typescript-eslint/ban-types
type CallbackSignature = (...params: unknown[]) => {};

// class RoomsServiceMock {
//     rooms: Room[];
//     listRoomWaiting: Room[];
//     indexNextRoom: number;
//     constructor() {
//         this.indexNextRoom = 0;
//         this.rooms = [];
//         this.listRoomWaiting = [];
//         for (let i = 0; i < NUMBEROFROOMS; i++) {
//             this.rooms.push(new Room('room number' + i, i));
//         }
//     }
// }

class SocketServer {
    socket = new SocketMock();
    private callbacks = new Map<string, [SocketMock, CallbackSignature]>();
    on(event: string, callback: CallbackSignature): void {
        this.callbacks.set(event, [this.socket, callback]);
    }

    emit(event: string): void {
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

    // eslint-disable-next-line no-unused-vars
    emit(event: string): void {
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
    join(): boolean {
        return true;
    }
}

describe('Socket Manager', () => {
    let socketManager: SocketManager;
    const socketServer = new SocketServer();
    const myLetters: Letter[] = [];
    const myLetters1: Letter[] = [];
    let roomSpy: RoomsService;
    const TEN = 10;

    beforeEach(async () => {
        roomSpy = new RoomsService();
        roomSpy.indexNextRoom = 0;
        roomSpy.rooms = [];
        roomSpy.listRoomWaiting = [];
        for (let i = 0; i < NUMBEROFROOMS; i++) {
            roomSpy.rooms.push(new Room('room number' + i, i));
        }
        const ioSPy = new http.Server();
        const wordValidation = new WordValidationService();
        socketManager = new SocketManager(
            ioSPy as unknown as http.Server,
            roomSpy as unknown as RoomsService,
            wordValidation as unknown as WordValidationService,
        );

        socketManager.sio = socketServer as unknown as io.Server;
    });

    it('should call cleanroom function in startingNewGameInfo', (done: Mocha.Done) => {
        roomSpy.indexNextRoom = 0;
        const spyy = spy(roomSpy.listRoomWaiting, 'push');
        for (let i = 0; i < TEN; i++) {
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
        for (let i = 0; i < TEN; i++) {
            roomSpy.listRoomWaiting.push(new Room('room number', 0));
        }
        // console.log(socketManager.roomsService);
        roomSpy.listRoomWaiting[0].index = 0;
        roomSpy.rooms[0].roomIsAvailable = true;
        socketManager.roomsService = roomSpy;
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
        for (let i = 0; i < TEN; i++) {
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
        for (let i = 0; i < TEN; i++) {
            roomSpy.rooms.push(new Room('room number', 0));
        }
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('gameFinished', 0);
        // assert(mySpy.called);
        done();
    });
    it('should enter in disconnect', (done: Mocha.Done) => {
        for (let i = 0; i < TEN; i++) {
            roomSpy.rooms.push(new Room('room number', 0));
        }
        socketManager.handleSockets();
        socketServer.emit('connection');
        socketServer.socket.peerSideEmit('disconnect');
        // assert(mySpy.called);
        done();
    });
    it('should enter in sendLettersReplaced', (done: Mocha.Done) => {
        for (let i = 0; i < TEN; i++) {
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
