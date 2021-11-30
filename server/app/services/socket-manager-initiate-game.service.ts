import { Position } from '@app/classes/position-tile-interface';
import { Room } from '@app/classes/room';
import { NUMBEROFROOMS } from '@app/constants';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { RoomsService } from './rooms.service';
import { WordValidationService } from './word-validation.service';

@Service()
export class SocketManager {
    games: string[][];
    boards: Position[][][];
    sio: io.Server;

    constructor(server: http.Server, public roomsService: RoomsService, public wordValidationService: WordValidationService) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.games = new Array(new Array());
        this.boards = new Array(new Array(new Array()));
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
                    message.lettersCreator,
                    message.lettersOpponent,
                    message.objectivesCreator,
                    message.objectivesJoiner,
                    message.bonus,
                    message.isGameMode2990,
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
                        if (this.roomsService.rooms[roomNumber].playerNames[0] !== info.playerJoinName) {
                            socket.join(this.roomsService.rooms[roomNumber].roomName);
                            // adding player name to the room
                            this.roomsService.rooms[roomNumber].playerNames[1] = info.playerJoinName;
                            // adding socket id to the room
                            this.roomsService.rooms[roomNumber].socketsId[1] = socket.id;
                            this.sio
                                .to(this.roomsService.rooms[roomNumber].roomName)
                                .emit('CancellationIndexes', [this.roomsService.indexNextRoom, this.roomsService.listRoomWaiting.length - 1]);
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
                        }
                    } else {
                        socket.emit('roomOccupied');
                    }
                } else {
                    socket.emit('roomOccupied');
                }
            });
            socket.on('returnListOfGames', () => {
                this.games.length = 0;
                this.boards.length = 0;
                let k = 0;
                while (k < this.roomsService.listRoomWaiting.length) {
                    if (!this.roomsService.listRoomWaiting[k].roomIsAvailable) {
                        this.roomsService.listRoomWaiting.splice(k, 1);
                    }
                    k++;
                }
                for (let i = 0; i < this.roomsService.listRoomWaiting.length; i++) {
                    if (this.roomsService.listRoomWaiting !== undefined) {
                        this.games.push([
                            'name',
                            'bonus',
                            'time',
                            'lettersOfCreator',
                            'lettersJoiner',
                            'objectivesCreator',
                            'objectivesJoiner',
                            'is2990',
                        ]);
                        this.games[i][0] = this.roomsService.listRoomWaiting[i].playerNames[0];
                        this.games[i][1] = this.roomsService.listRoomWaiting[i].bonusOn.toString();
                        this.games[i][2] = this.roomsService.listRoomWaiting[i].timePerTurn.toString();
                        this.games[i][3] = this.roomsService.listRoomWaiting[i].returnLettersInString(true); // letters of creator
                        this.games[i][4] = this.roomsService.listRoomWaiting[i].returnLettersInString(false); // letters of joiner
                        this.games[i][5] = this.roomsService.listRoomWaiting[i].objectivesCreator.join('');
                        this.games[i][6] = this.roomsService.listRoomWaiting[i].objectivesJoiner.join('');
                        this.games[i][7] = this.roomsService.listRoomWaiting[i].is2990.toString();
                        this.boards.push(this.roomsService.listRoomWaiting[i].bonusTiles);
                    }
                }
                socket.emit('sendGamesInformation', { games: this.games, boards: this.boards });
            });
            socket.on('validateWordOnServer', (wordCreated, ackCallback) => {
                socket.emit('wordValidation', this.wordValidationService.isWordValid(wordCreated));
                ackCallback(this.wordValidationService.isWordValid(wordCreated));
            });
            socket.on('cancelWaitingGame', (indexes) => {
                this.roomsService.indexNextRoom--;
                this.roomsService.rooms[indexes[0]] = new Room('room number' + indexes[0], indexes[0]);
                this.roomsService.listRoomWaiting.splice(indexes[1], 1);
            });

            socket.on('toOpponent', (message, gameStatus, roomNumber) => {
                const gameStatusToSendTo = gameStatus === 0 ? 1 : 0;
                this.sio.to(this.roomsService.rooms[roomNumber].socketsId[gameStatusToSendTo]).emit('toPlayer', message);
            });

            socket.on('sendLettersReplaced', (lettersReplaced, gameStatus, roomNumber) => {
                const gameStatusToSendTo = gameStatus === 0 ? 1 : 0;
                this.sio.to(this.roomsService.rooms[roomNumber].socketsId[gameStatusToSendTo]).emit('receiveLettersReplaced', lettersReplaced);
            });
            socket.on('gameFinished', (roomNumber) => {
                this.roomsService.rooms[roomNumber].setRoomOccupied();
                let k = 0;
                while (k < this.roomsService.listRoomWaiting.length) {
                    if (!this.roomsService.listRoomWaiting[k].roomIsAvailable) {
                        this.roomsService.listRoomWaiting.splice(k, 1);
                    }
                    k++;
                }
                this.roomsService.indexNextRoom--;
                this.roomsService.rooms[roomNumber] = new Room('room number' + roomNumber, roomNumber);
            });

            socket.on('disconnect', () => {
                let index = 0;
                for (const room of this.roomsService.rooms) {
                    for (const socketId of room.socketsId) {
                        if (socketId === socket.id) {
                            this.sio.to(this.roomsService.rooms[index].roomName).emit('gameIsFinished');
                            this.roomsService.rooms[index].setRoomOccupied();
                            let k = 0;
                            while (k < this.roomsService.listRoomWaiting.length) {
                                if (!this.roomsService.listRoomWaiting[k].roomIsAvailable) {
                                    this.roomsService.listRoomWaiting.splice(k, 1);
                                }
                                k++;
                            }
                            this.roomsService.indexNextRoom--;
                            this.roomsService.rooms[index] = new Room('room number' + index, index);
                            break;
                        }
                    }
                    ++index;
                }
            });
        });
    }
}
