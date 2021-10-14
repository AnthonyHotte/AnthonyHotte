import * as io from 'socket.io';
import * as http from 'http';
import { Room } from '@app/classes/room';
import { ERRORCODE, NUMBEROFROOMS } from '@app/constants';

export class SocketManager {
    private sio: io.Server;
    private rooms: Room[];
    private listRoomWaiting: Room[];
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.rooms = [];
        this.listRoomWaiting = [];
        for (let i = 0; i < NUMBEROFROOMS; i++) {
            this.rooms.push(new Room('room number' + i, i));
        }
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            socket.on('startingNewGameInfo', (message) => {
                socket.join(this.rooms[0].roomName);
                this.rooms[0].setStartingInfo(message.time, message.namePlayer, socket.id, message.bonusOn, message.mode);
                // start game if in solo mode
                if (message.mode === 'solo') {
                    socket.emit('startGame');
                } else {
                    this.listRoomWaiting.push(this.rooms[0]);
                }
            });
            socket.on('joinGame', (name) => {
                socket.join(this.rooms[0].roomName);
                this.rooms[0].playerNames.push(name);
                this.rooms[0].socketsId.push(socket.id);
                this.listRoomWaiting.splice(0, 1);
                this.sio.to(this.rooms[0].roomName).emit('startGame', this.rooms[0]);
            });
            socket.on('disconnect', () => {
                const index = this.rooms[0].socketsId.indexOf(socket.id);
                if (index !== ERRORCODE) {
                    this.rooms[0].socketsId.splice(index, 1);
                    this.rooms[0].playerNames.splice(index, 1);
                }
            });
        });
    }
}
