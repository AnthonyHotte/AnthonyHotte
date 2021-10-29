import { Injectable } from '@angular/core';
import { MessagePlayer } from '@app/message';
import { Observable, Subject } from 'rxjs';
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
    gameLists: string[][] = [[]];
    textBoxMessageObservable: Observable<MessagePlayer>;
    messageSubject: Subject<MessagePlayer>;

    constructor(
        private messageService: MessageService,
        private letterService: LetterService,
        private timerTurnManagerService: TimerTurnManagerService,
        private initiateGameTypeService: InitiateGameTypeService,
    ) {
        this.configureBaseSocketFeatures();
        this.messageSubject = new Subject();
    }

    getMessageObservable() {
        return this.messageSubject.asObservable();
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
            if (this.initiateGameTypeService.gameType === 'multi player') {
                this.letterService.players[1].name = info.room.playerNames[1];
            }
            this.timerTurnManagerService.turn = info.indexPlayerStart;
            this.messageService.startGame();
        });
        this.socket.on('sendGamesInformation', (games) => {
            for (let i = 0; i < games.length; i++) {
                this.gameLists[i][0] = games[i][0]; // player name of who is the game initiator
                this.gameLists[i][1] = games[i][1]; // is random bonus on
                this.gameLists[i][2] = games[i][2]; // time per turn
            }
        });
    }
    sendInitiateNewGameInformation(playTime: number, isBonusRandom: boolean, name: string, gameType: string) {
        this.socket.emit('startingNewGameInfo', { time: playTime, bonusOn: isBonusRandom, namePlayer: name, mode: gameType });
    }
    sendJoinGameInfo(name: string) {
        this.socket.emit('joinGame', name);
    }
    sendGameListNeededNotification() {
        this.socket.emit('returnListOfGames');
    }
    configureSendMessageToServer(message?: MessagePlayer, toAll?: boolean) {
        // envoyer une commande qui sera gere par le serveur
        if (!toAll && message !== undefined && toAll !== undefined) {
            this.socket.emit('toServer', message.message, message.sender, message.role);
        }
        // envoyer un message a tout le monde sauf au sender
        else if (message !== undefined && toAll !== undefined) {
            this.socket.emit('toAll', message.message, message.sender, message.role);
        }
        // gerer le message envoye par le serveur
        this.socket.on('toAllClient', (message_: string, sender_: string, role_: string) => {
            const myMessage: MessagePlayer = { message: message_, sender: sender_, role: role_ };
            this.messageSubject.next(myMessage);
        });
        // gerer la commande entre par le joueur
        this.socket.on('toClient', (message_: string, sender_: string, role_: string) => {
            const myMessage: MessagePlayer = { message: message_, sender: sender_, role: role_ };
            this.messageSubject.next(myMessage);
        });
    }
}
// à envoyer
// tableau lettre
// gestion du temps
// reserve lettre
// validation cote serveur
