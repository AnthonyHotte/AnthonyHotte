import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket: Socket;
    configureBaseSocketFeatures() {
        // Afficher l'identifiant du Socket dans l'interface
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log('connected!');
        });
    }
}
