import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { InitiateGameTypeService } from './initiate-game-type.service';
import { LetterService } from './letter.service';
import { MessageService } from './message.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket = io('http://localhost:3000');

    constructor(
        private messageService: MessageService,
        private letterService: LetterService,
        private timerTurnManagerService: TimerTurnManagerService,
        private initiateGameTypeService: InitiateGameTypeService,
    ) {
        this.configureBaseSocketFeatures();
    }

    configureBaseSocketFeatures() {
        // Afficher l'identifiant du Socket dans l'interface
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log('connected!');
        });
        this.socket.on('startGame', (info) => {
            this.initiateGameTypeService.roomNumber = info.room.index;
            this.letterService.players[0].name = info.room.playerNames[0];
            this.letterService.players[1].name = info.room.playerNames[1];
            this.timerTurnManagerService.turn = info.indexPlayerStart;
            this.messageService.startGame();
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
