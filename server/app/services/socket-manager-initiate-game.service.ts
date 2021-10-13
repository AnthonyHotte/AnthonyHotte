import * as io from 'socket.io';
import * as http from 'http';

export class SocketManager {
    private sio: io.Server;
    private rooms: string[];
    // private room: string = 'serverRoom';
    constructor(server: http.Server) {
        this.sio = new io.Server(server, { cors: { origin: '*', methods: ['GET', 'POST'] } });
        this.rooms = [];
        // eslint-disable-next-line @typescript-eslint/no-magic-numbers
        for (let i = 0; i < 50; i++) {
            this.rooms.push('room number ' + i);
        }
    }

    handleSockets(): void {
        this.sio.on('connection', (socket) => {
            // eslint-disable-next-line no-console
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            this.sio.on('playTime', (message) => {
                // eslint-disable-next-line no-console
                console.log('yeah');
                // eslint-disable-next-line no-console
                console.log(`reception du temps: ${message}`);
            });
            this.sio.on('joinRoom', () => {
                socket.join(this.rooms[0]);
                // eslint-disable-next-line no-console
                console.log(`${socket.id} joining room 0`);
            });
            this.sio.on('disconnect', () => {
                // eslint-disable-next-line no-console
                console.log(`déconnexion par l'utilisateur avec id : ${socket.id}`);
            });
        });
    }
}
/*
        this.sio.on('connection', (socket) => {
            console.log(`Connexion par l'utilisateur avec id : ${socket.id}`);
            // message initial
            socket.emit('hello', 'Hello World!');

            socket.on('message', (message: string) => {
                console.log(message);
            });
            socket.on('validate', (word: string) => {
                const isValid = word.length > 5;
                socket.emit('wordValidated', isValid);
            });

            socket.on('broadcastAll', (message: string) => {
                this.sio.sockets.emit('massMessage', `${socket.id} : ${message}`);
            });

            socket.on('joinRoom', () => {
                socket.join(this.room);
            });

            socket.on('roomMessage', (message: string) => {
                this.sio.to(this.room).emit('roomMessage', `${socket.id} : ${message}`);
            });

            socket.on('disconnect', (reason) => {
                console.log(`Deconnexion par l'utilisateur avec id : ${socket.id}`);
                console.log(`Raison de deconnexion : ${reason}`);
            });
        });

        setInterval(() => {
            this.emitTime();
        }, 1000);
    }
    

    private emitTime() {
        this.sio.sockets.emit('clock', new Date().toLocaleTimeString());
    }
*/
