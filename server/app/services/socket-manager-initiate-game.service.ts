import { NUMBEROFROOMS } from '@app/constants';
import * as http from 'http';
import * as io from 'socket.io';
import { Service } from 'typedi';
import { RoomsService } from './rooms.service';

@Service()
export class SocketManager {
    games: string[][] = new Array(new Array());
    private sio: io.Server;

    constructor(server: http.Server, private roomsService: RoomsService) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
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
                    message.mode,
                );
                // start game if in solo mode
                if (message.mode === 'solo') {
                    socket.emit('startGame', {
                        room: this.roomsService.rooms[this.roomsService.indexNextRoom],
                        playerNumber: 0,
                        indexPlayerStart: this.roomsService.rooms[this.roomsService.indexNextRoom].turn,
                    });
                } else {
                    // put the room in the waiting room list
                    this.roomsService.listRoomWaiting.push(this.roomsService.rooms[this.roomsService.indexNextRoom]);
                }
                // increment next room index but make sure it is not above 50
                this.roomsService.indexNextRoom = ++this.roomsService.indexNextRoom % NUMBEROFROOMS;
            });
            socket.on('joinGame', (name) => {
                // join the oldest game in the waiting room
                socket.join(this.roomsService.rooms[this.roomsService.listRoomWaiting[0].index].roomName);
                // adding player name to the room
                this.roomsService.rooms[this.roomsService.listRoomWaiting[0].index].playerNames[1] = name;
                // adding socket id to the room
                this.roomsService.rooms[this.roomsService.listRoomWaiting[0].index].socketsId[1] = socket.id;
                // start game for everyone in the room
                this.sio.to(this.roomsService.rooms[this.roomsService.listRoomWaiting[0].index].roomName).emit('startGame', {
                    room: this.roomsService.rooms[this.roomsService.listRoomWaiting[0].index],
                    playerNumber: 1,
                    indexPlayerStart: this.roomsService.rooms[this.roomsService.listRoomWaiting[0].index].turn,
                });
                // take of the room from waiting room
                this.roomsService.listRoomWaiting.splice(0, 1);
            });
            socket.on('returnListOfGames', () => {
                this.games = new Array(new Array());
                for (let i = 0; i < this.roomsService.indexNextRoom; i++) {
                    if (!this.roomsService.rooms !== undefined || this.games !== undefined) {
                        this.games[i][0] = this.roomsService.rooms[i].playerNames[0];
                        this.games[i][1] = this.roomsService.rooms[i].bonusOn.toString();
                        this.games[i][2] = this.roomsService.rooms[i].timePerTurn.toString();
                    }
                }
                socket.emit('sendGamesInformation', this.games);
            });
            socket.on('toServer', (message: string, sender: string, role: string) => {
                socket.emit('toClient', message, sender, role);
            });
            socket.on('toAll', (message: string, sender: string, role: string) => {
                socket.broadcast.emit('toAllClient', message, sender, role);
            });
        });
    }
}
