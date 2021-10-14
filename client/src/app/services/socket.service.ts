import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { io } from 'socket.io-client';
import { StartCounterService } from './start-counter.service';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket = io('http://localhost:3000');

    constructor(private link: Router, private startCounterService: StartCounterService) {
        this.configureBaseSocketFeatures();
    }

    configureBaseSocketFeatures() {
        // Afficher l'identifiant du Socket dans l'interface
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log('connected!');
        });
        this.socket.on('startMultiGame', () => {
            // eslint-disable-next-line no-console
            console.log('yeah!!!');
            this.link.navigate(['/game']);
            this.startCounterService.startGame();
        });
    }
    sendInitiateNewGameInformation(playTime: number, isBonusRandom: boolean, name: string, gameType: string) {
        this.socket.emit('startingNewGameInfo', { time: playTime, bonusOn: isBonusRandom, namePlayer: name, mode: gameType });
    }
    sendJoinGameInfo(name: string) {
        this.socket.emit('joinGame', name);
    }
}
// à envoyer
// tableau lettre
// gestion du temps
// reserve lettre
// validation cote serveur
