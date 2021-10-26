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
    gameLists: string[][];

    constructor(
        private messageService: MessageService,
        private letterService: LetterService,
        private timerTurnManagerService: TimerTurnManagerService,
        private initiateGameTypeService: InitiateGameTypeService,
    ) {
        this.configureBaseSocketFeatures();
        this.gameLists = [[]];
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
                this.timerTurnManagerService.setGameStatus(info.playerNumber, 'multi player');
            } else {
                this.timerTurnManagerService.setGameStatus(info.playerNumber, 'solo');
            }
            this.timerTurnManagerService.turn = info.indexPlayerStart;
            this.messageService.startGame();
        });
        this.socket.on('sendGamesInformation', (games) => {
            // eslint-disable-next-line no-console
            console.log('game information');
            for (let i = 0; i < games.length; i++) {
                this.gameLists[i][0] = games[i][0]; // player name of who is the game initiator
                this.gameLists[i][1] = games[i][1]; // is random bonus on
                this.gameLists[i][2] = games[i][2]; // time per turn
            }
        });
        this.socket.on('joinPlayerTurnFromServer', (skippedTurn) => {
            // start join turn
            this.timerTurnManagerService.turn = 1;
            this.timerTurnManagerService.turnsSkippedInARow = skippedTurn;
        });
        this.socket.on('createrPlayerTurnFromServer', (skippedTurn) => {
            // start creater turn
            this.timerTurnManagerService.turn = 0;
            this.timerTurnManagerService.turnsSkippedInARow = skippedTurn;
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
    sendJoinPlayerTurn() {
        this.socket.emit('joinPLayerTurn', {
            roomName: this.initiateGameTypeService.roomNumber,
            numberSkipTurn: this.timerTurnManagerService.turnsSkippedInARow,
        });
    }
    sendCreaterPlayerTurn() {
        this.socket.emit(
            'createrPlayerTurn',
            this.socket.emit('joinPLayerTurn', {
                roomNumber: this.initiateGameTypeService.roomNumber,
                numberSkipTurn: this.timerTurnManagerService.turnsSkippedInARow,
            }),
        );
    }
}
