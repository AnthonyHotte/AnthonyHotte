import * as io from 'socket.io';
import * as http from 'http';
import { Room } from '@app/classes/room';
import { ERRORCODE } from '@app/constants';

export class SocketManager {
    private sio: io.Server;
    private rooms: Room[];
    // private room: string = 'serverRoom';
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.rooms = [];
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let i = 0; i < 50; i++) {
            this.rooms.push(new Room('room number' + i, i));
        }
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            socket.on('startingNewGameInfo', (message) => {
                socket.join(this.rooms[0].roomName);
                this.rooms[0].setStartingInfo(message.time, message.namePlayer, socket.id, message.bonusOn, message.gameType);
            });
            socket.on('joinGame', (name) => {
                socket.join(this.rooms[0].roomName);
                this.rooms[0].playerNames.push(name);
                this.rooms[0].socketsId.push(socket.id);
                this.sio.sockets.emit('startMultiGame', this.rooms[0]);
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
