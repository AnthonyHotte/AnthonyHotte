import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket = io('http://localhost:3000');

    configureBaseSocketFeatures() {
        // Afficher l'identifiant du Socket dans l'interface
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log('connected!');
        });
    }
    sendInitiateGameInformation(playTime: number, isBonusRandom: boolean, name: string, gameType: string, isNewGame: boolean) {
        this.socket.emit('joinRoom');
        this.socket.emit('startingInfo', { time: playTime, bonusOn: isBonusRandom, namePlayer: name, mode: gameType, created: isNewGame });
    }
}
// à envoyer
// tableau lettre
// gestion du temps
// reserve lettre
// validation cote serveur
