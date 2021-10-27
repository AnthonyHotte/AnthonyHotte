import { Injectable } from '@angular/core';
import { GameStatus } from '@app/game-status';
import { BehaviorSubject } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket = io('http://localhost:3000');
    gameLists: string[][];
    roomNumber: number;
    startGame: BehaviorSubject<boolean>;
    gameStatus: BehaviorSubject<GameStatus>;
    playerNameIndexZer0: BehaviorSubject<string>;
    playerNameIndexOne: BehaviorSubject<string>;
    turn: BehaviorSubject<number>;
    skippedTurn: BehaviorSubject<number>;

    constructor() {
        this.gameLists = [[]];
        this.startGame = new BehaviorSubject<boolean>(false);
        this.roomNumber = 0;
        this.gameStatus = new BehaviorSubject<GameStatus>(0);
        // default value shoul be over right
        this.playerNameIndexZer0 = new BehaviorSubject<string>('joueur1');
        // default value should be over right
        this.playerNameIndexOne = new BehaviorSubject<string>('joueur2');
        // default value should never be over right
        this.turn = new BehaviorSubject<number>(0);
        // default value should never be over right
        this.skippedTurn = new BehaviorSubject<number>(0);
        this.configureBaseSocketFeatures();
    }

    configureBaseSocketFeatures() {
        // Afficher l'identifiant du Socket dans l'interface
        this.socket.on('connect', () => {
            // eslint-disable-next-line no-console
            console.log('connected!');
        });
        this.socket.on('startGame', (info) => {
            this.roomNumber = info.room.index;
            this.playerNameIndexZer0.next(info.playerName);
            this.playerNameIndexOne.next(info.opponentName);
            this.turn.next(info.indexPlayerStart);
            this.startGame.next(true);
        });
        this.socket.on('gameMode', (gameMode) => {
            this.gameStatus.next(gameMode);
        });
        this.socket.on('sendGamesInformation', (games) => {
            for (let i = 0; i < games.length; i++) {
                this.gameLists[i][0] = games[i][0]; // player name of who is the game initiator
                this.gameLists[i][1] = games[i][1]; // is random bonus on
                this.gameLists[i][2] = games[i][2]; // time per turn
            }
        });
        this.socket.on('joinPlayerTurnFromServer', (skippedTurn) => {
            // start join turn
            this.turn.next(1);
            this.skippedTurn.next(skippedTurn);
        });
        this.socket.on('createrPlayerTurnFromServer', (skippedTurn) => {
            // start creater turn
            this.turn.next(0);
            this.skippedTurn.next(skippedTurn);
        });
    }
    sendInitiateNewGameInformation(playTime: number, isBonusRandom: boolean, name: string, gameStatus: GameStatus, opponentName: string) {
        this.socket.emit('startingNewGameInfo', {
            time: playTime,
            bonusOn: isBonusRandom,
            namePlayer: name,
            mode: gameStatus,
            nameOpponent: opponentName,
        });
    }
    sendJoinGameInfo(name: string, indexWaitingRoom: number) {
        this.socket.emit('joinGame', { playerJoinName: name, indexInWaitingRoom: indexWaitingRoom });
    }
    sendGameListNeededNotification() {
        this.socket.emit('returnListOfGames');
    }
    sendJoinPlayerTurn(turnsSkippedInARow: number) {
        this.socket.emit('joinPLayerTurn', {
            roomName: this.roomNumber,
            numberSkipTurn: turnsSkippedInARow,
        });
    }
    sendCreaterPlayerTurn(turnsSkippedInARow: number) {
        this.socket.emit(
            'createrPlayerTurn',
            this.socket.emit('joinPLayerTurn', {
                roomNumber: this.roomNumber,
                numberSkipTurn: turnsSkippedInARow,
            }),
        );
    }
}
