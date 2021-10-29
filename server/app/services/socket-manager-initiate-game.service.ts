import { MAX_NUMBER_SKIPPED_TURNS, NUMBEROFROOMS } from '@app/constants';
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
        this.games = [[]];
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
                    });
                    socket.emit('gameMode', message.mode);
                } else {
                    // put the room in the waiting room list
                    this.roomsService.listRoomWaiting.push(this.roomsService.rooms[this.roomsService.indexNextRoom]);
                }
                // increment next room index but make sure it is not above 50
                this.roomsService.indexNextRoom = ++this.roomsService.indexNextRoom % NUMBEROFROOMS;
            });
            socket.on('joinGame', (info) => {
                // join the waiting room
                const roomNumber = this.roomsService.listRoomWaiting[info.indexInWaitingRoom].index;
                socket.join(this.roomsService.rooms[roomNumber].roomName);
                // adding player name to the room
                this.roomsService.rooms[roomNumber].playerNames[1] = info.playerJoinName;
                // adding socket id to the room
                this.roomsService.rooms[roomNumber].socketsId[1] = socket.id;
                // start game for everyone in the room
                // have to change the 0 index
                socket.emit('gameMode', 1);
                // send information to the other in the room
                this.sio.to(this.roomsService.rooms[roomNumber].socketsId[0]).emit('gameMode', 0);
                // send information to every one in the room
                this.sio.to(this.roomsService.rooms[roomNumber].roomName).emit('startGame', {
                    room: this.roomsService.rooms[roomNumber],
                    indexPlayerStart: this.roomsService.rooms[roomNumber].startTurn,
                    playerName: this.roomsService.rooms[roomNumber].playerNames[0],
                    opponentName: this.roomsService.rooms[roomNumber].playerNames[1],
                });
                // take of the room from waiting room
                this.roomsService.listRoomWaiting.splice(info.indexInWaitingRoom, 1);
            });
            socket.on('returnListOfGames', () => {
                this.games = new Array(new Array());
                for (let i = 0; i < this.roomsService.listRoomWaiting.length; i++) {
                    if (!this.roomsService.rooms !== undefined || this.games !== undefined) {
                        this.games[i][0] = this.roomsService.rooms[i].playerNames[0];
                        this.games[i][1] = this.roomsService.rooms[i].bonusOn.toString();
                        this.games[i][2] = this.roomsService.rooms[i].timePerTurn.toString();
                    }
                }
                socket.emit('sendGamesInformation', this.games);
            });
            socket.on('joinPLayerTurn', (endTurnInfo) => {
                this.roomsService.rooms[endTurnInfo.roomNumber].turnsSkippedInARow = endTurnInfo.numberSkipTurn;
                if (this.roomsService.rooms[endTurnInfo.roomNumber].turnsSkippedInARow === MAX_NUMBER_SKIPPED_TURNS) {
                    // emit finish Game
                }
                // message to every one in the room
                this.sio
                    .to(this.roomsService.rooms[endTurnInfo.roomNumber].roomName)
                    .emit('joinPlayerTurnFromServer', this.roomsService.rooms[endTurnInfo.roomNumber].turnsSkippedInARow);
            });
            socket.on('createrPlayerTurn', (endTurnInfo) => {
                this.roomsService.rooms[endTurnInfo.roomNumber].turnsSkippedInARow = endTurnInfo.numberSkipTurn;
                if (this.roomsService.rooms[endTurnInfo.roomNumber].turnsSkippedInARow === MAX_NUMBER_SKIPPED_TURNS) {
                    // emit finish Game
                }
                // message to every one in the room
                this.sio
                    .to(this.roomsService.rooms[endTurnInfo.roomNumber].roomName)
                    .emit('createrPlayerTurnFromServer', this.roomsService.rooms[endTurnInfo.roomNumber].turnsSkippedInARow);
            });
        });
    }
}
