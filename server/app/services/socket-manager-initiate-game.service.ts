import * as io from 'socket.io';
import * as http from 'http';
import { Room } from '@app/classes/room';
import { ERRORCODE, NUMBEROFROOMS } from '@app/constants';

export class SocketManager {
    private sio: io.Server;
    private rooms: Room[];
    private listRoomWaiting: Room[];
    private indexNextRoom: number;
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.rooms = [];
        this.listRoomWaiting = [];
        this.indexNextRoom = 0;
        for (let i = 0; i < NUMBEROFROOMS; i++) {
            this.rooms.push(new Room('room number' + i, i));
        }
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('startingNewGameInfo', (message) => {
                socket.join(this.rooms[this.indexNextRoom].roomName);
                // set the room parameters
                this.rooms[0].setStartingInfo(message.time, message.namePlayer, socket.id, message.bonusOn, message.mode);
                // start game if in solo mode
                if (message.mode === 'solo') {
                    socket.emit('startGame');
                } else {
                    // put the room in the waiting room list
                    this.listRoomWaiting.push(this.rooms[this.indexNextRoom]);
                }
                // increment next room index but make sure it is not above 50
                this.indexNextRoom = ++this.indexNextRoom % NUMBEROFROOMS;
            });
            socket.on('joinGame', (name) => {
                // join the oldest game in the waiting room
                socket.join(this.rooms[this.listRoomWaiting[0].index].roomName);
                // adding player name to the room
                this.rooms[this.listRoomWaiting[0].index].playerNames.push(name);
                // adding socket id to the room
                this.rooms[this.listRoomWaiting[0].index].socketsId.push(socket.id);
                // start game for everyone in the room
                this.sio.to(this.rooms[this.listRoomWaiting[0].index].roomName).emit('startGame', this.rooms[this.indexNextRoom]);
                // take of the room from waiting room
                this.listRoomWaiting.splice(0, 1);
            });
            socket.on('disconnect', () => {
                const index = this.rooms[this.indexNextRoom].socketsId.indexOf(socket.id);
                if (index !== ERRORCODE) {
                    this.rooms[this.indexNextRoom].socketsId.splice(index, 1);
                    this.rooms[this.indexNextRoom].playerNames.splice(index, 1);
                }
            });
        });
    }
}
