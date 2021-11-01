import { Room } from '@app/classes/room';
import { NUMBEROFROOMS } from '@app/constants';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { RoomsService } from './rooms.service';

@Service()
export class SocketManager {
    games: string[][];
    private sio: io.Server;

    constructor(server: http.Server, private roomsService: RoomsService) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.games = new Array(new Array());
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('startingNewGameInfo', (message) => {
                // some clean up
                this.roomsService.rooms[this.roomsService.indexNextRoom].cleanRoom();
                socket.join(this.roomsService.rooms[this.roomsService.indexNextRoom].roomName);
                // set the room parameters
                this.roomsService.rooms[this.roomsService.indexNextRoom].setStartingInfo(
                    message.time,
                    message.namePlayer,
                    socket.id,
                    message.bonusOn,
                );
                // start game if in solo mode
                if (message.mode === 2) {
                    socket.emit('startGame', {
                        room: this.roomsService.rooms[this.roomsService.indexNextRoom],
                        indexPlayerStart: this.roomsService.rooms[this.roomsService.indexNextRoom].startTurn,
                        playerName: message.namePlayer,
                        opponentName: message.nameOpponent,
                        gameMode: message.mode,
                    });
                    // removes possibility to join room
                    this.roomsService.rooms[this.roomsService.indexNextRoom].setRoomOccupied();
                    this.roomsService.listRoomWaiting.splice(this.roomsService.indexNextRoom, 1);
                } else {
                    // put the room in the waiting room list
                    this.roomsService.listRoomWaiting.push(this.roomsService.rooms[this.roomsService.indexNextRoom]);
                    socket.emit('CancellationIndexes', [this.roomsService.indexNextRoom, this.roomsService.listRoomWaiting.length - 1]);
                }
                // increment next room index but make sure it is not above 50
                this.roomsService.indexNextRoom = ++this.roomsService.indexNextRoom % NUMBEROFROOMS;
            });
            socket.on('joinGame', (info) => {
                if (this.roomsService.listRoomWaiting.length !== 0) {
                    // join the waiting room
                    const roomNumber = this.roomsService.listRoomWaiting[info.indexInWaitingRoom].index;
                    if (this.roomsService.rooms[roomNumber].roomIsAvailable) {
                        socket.join(this.roomsService.rooms[roomNumber].roomName);
                        // adding player name to the room
                        this.roomsService.rooms[roomNumber].playerNames[1] = info.playerJoinName;
                        // adding socket id to the room
                        this.roomsService.rooms[roomNumber].socketsId[1] = socket.id;
                        // start game for the joiner
                        socket.emit('startGame', {
                            room: this.roomsService.rooms[roomNumber],
                            indexPlayerStart: (this.roomsService.rooms[roomNumber].startTurn + 1) % 2,
                            playerName: this.roomsService.rooms[roomNumber].playerNames[0],
                            opponentName: this.roomsService.rooms[roomNumber].playerNames[1],
                            gameMode: 1,
                        });
                        // send information to the creater of the game
                        this.sio.to(this.roomsService.rooms[roomNumber].socketsId[0]).emit('startGame', {
                            room: this.roomsService.rooms[roomNumber],
                            indexPlayerStart: this.roomsService.rooms[roomNumber].startTurn,
                            playerName: this.roomsService.rooms[roomNumber].playerNames[0],
                            opponentName: this.roomsService.rooms[roomNumber].playerNames[1],
                            gameMode: 0,
                        });
                        // take of the room from waiting room
                        this.roomsService.listRoomWaiting.splice(info.indexInWaitingRoom, 1);
                        // puts the room in occupied state
                        this.roomsService.rooms[roomNumber].setRoomOccupied();
                    } else {
                        socket.emit('roomOccupied');
                    }
                } else {
                    socket.emit('roomOccupied');
                }
            });
            socket.on('returnListOfGames', () => {
                this.games.length = 0;
                for (let i = 0; i < this.roomsService.listRoomWaiting.length; i++) {
                    if (this.roomsService.listRoomWaiting !== undefined) {
                        this.games.push(['name', 'bonus', 'time']);
                        this.games[i][0] = this.roomsService.listRoomWaiting[i].playerNames[0];
                        this.games[i][1] = this.roomsService.listRoomWaiting[i].bonusOn.toString();
                        this.games[i][2] = this.roomsService.listRoomWaiting[i].timePerTurn.toString();
                    }
                }
                socket.emit('sendGamesInformation', this.games);
            });
            socket.on('endTurn', (endTurn) => {
                this.roomsService.rooms[endTurn.roomNumber].turnsSkippedInARow = endTurn.numberSkipTurn;
                this.sio.to(this.roomsService.rooms[endTurn.roomNumber].socketsId[endTurn.playerTurnStatus]).emit('yourTurn');
            });
            socket.on('cancelWaitingGame', (indexes) => {
                this.roomsService.indexNextRoom--;
                this.roomsService.rooms.splice(indexes[0], 1);
                this.roomsService.rooms.push(new Room('room number' + this.roomsService.rooms.length, this.roomsService.rooms.length));
                this.roomsService.listRoomWaiting.splice(indexes[1], 1);

                socket.on('toServer', (message) => {
                    socket.emit('toClient', message);
                });

                socket.on('toAll', (message) => {
                    socket.broadcast.emit('toAllClient', message);
                });
            });
        });
    }
}
