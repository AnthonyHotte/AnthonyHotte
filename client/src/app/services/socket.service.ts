import { Injectable } from '@angular/core';
import { GameStatus } from '@app/game-status';
import { MessagePlayer } from '@app/message';
import { BehaviorSubject, Subject } from 'rxjs';
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
    messageSubject: Subject<MessagePlayer>;
    cancellationIndexes: number[];
    ableToJoin: boolean = true;
    isWordValidationFinished = false;
    wordIsValid = false;

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
        this.messageSubject = new Subject();
        this.cancellationIndexes = [1, 2]; // room number and waiting room number
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
            this.gameLists.length = 0;
            for (let i = 0; i < games.length; i++) {
                this.gameLists.push(['name', 'bonus', 'time']);
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
        // cancelled game indexes
        this.socket.on('CancellationIndexes', (indexes) => {
            this.cancellationIndexes[0] = indexes[0]; // room index
            this.cancellationIndexes[1] = indexes[1]; // waiting room index
        });
        // if room is unavailable for the joiner
        this.socket.on('roomOccupied', () => {
            this.ableToJoin = false;
        });

        this.socket.on('wordValidation', (wordIsValid) => {
            this.isWordValidationFinished = true;
            this.wordIsValid = wordIsValid === 'true' ? true : false;
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
    configureSendMessageToServer(message?: MessagePlayer, toAll?: boolean) {
        // envoyer une commande qui sera gere par le serveur
        // if (!toAll && message !== undefined && toAll !== undefined) {
        //     this.socket.emit('toServer', message.message, message.sender, message.role);
        // }
        if (!toAll && message !== undefined && toAll !== undefined) {
            this.socket.emit('toServer', message);
        }
        // envoyer un message a tout le monde sauf au sender
        // else if (message !== undefined && toAll !== undefined) {
        //     this.socket.emit('toAll', message.message, message.sender, message.role);
        // }
        else if (message !== undefined && toAll !== undefined) {
            this.socket.emit('toAll', message);
        }
        // gerer le message envoye par le serveur
        // this.socket.on('toAllClient', (message_: string, sender_: string, role_: string) => {
        //     const myMessage: MessagePlayer = { message: message_, sender: sender_, role: role_ };
        //     this.messageSubject.next(myMessage);
        // });
        this.socket.on('toAllClient', (myMessage) => {
            this.messageSubject.next(myMessage);
        });
        // gerer la commande entre par le joueur
        // this.socket.on('toClient', (message_: string, sender_: string, role_: string) => {
        //     const myMessage: MessagePlayer = { message: message_, sender: sender_, role: role_ };
        //     this.messageSubject.next(myMessage);
        // });
        this.socket.on('toClient', (myMessage) => {
            this.messageSubject.next(myMessage);
        });
    }
    sendJoinPlayerTurn(turnsSkippedInARow: number) {
        this.socket.emit('joinPLayerTurn', {
            roomNumber: this.roomNumber,
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
    cancelGame() {
        this.socket.emit('cancelWaitingGame', this.cancellationIndexes);
    }
    setAbleToJoinGame() {
        this.ableToJoin = true;
    }

    validateWord(wordCreated: string) {
        this.socket.emit('validateWordOnServer', wordCreated);
    }
}
