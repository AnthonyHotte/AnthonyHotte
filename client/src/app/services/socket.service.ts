import { Injectable } from '@angular/core';
import { GameStatus } from '@app/game-status';
import { Letter } from '@app/letter';
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
    messageSubject: Subject<string>;
    cancellationIndexes: number[];
    ableToJoin: boolean = true;
    nameOfRoomCreator: string = 'Default';
    gameMode = 2;
    lettersOfJoiner: Letter[] = [];
    lettersOfJoinerInStringForSynch: string = '';
    lettersToReplace = '';

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
            this.gameStatus.next(info.gameMode);
            this.roomNumber = info.room.index;
            if (info.gameMode === 1) {
                this.playerNameIndexZer0.next(info.opponentName);
                this.playerNameIndexOne.next(info.playerName);
            } else {
                this.playerNameIndexZer0.next(info.playerName);
                this.playerNameIndexOne.next(info.opponentName);
            }
            this.turn.next(info.indexPlayerStart);
            this.startGame.next(true);
        });
        this.socket.on('sendGamesInformation', (games) => {
            this.gameLists.length = 0;
            for (let i = 0; i < games.length; i++) {
                this.gameLists.push(['name', 'bonus', 'time', 'lettersCreator', 'lettersJoiner']);
                this.gameLists[i][0] = games[i][0]; // player name of who is the game initiator
                this.gameLists[i][1] = games[i][1]; // is random bonus on
                this.gameLists[i][2] = games[i][2]; // time per turn
                this.gameLists[i][3] = games[i][3]; // letters of creator
                this.gameLists[i][4] = games[i][4]; // letters of joiner
            }
        });
        this.socket.on('yourTurn', () => {
            this.turn.next(0);
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

        // gerer le message envoye par le serveur
        // this.socket.on('toAllClient', (message_: string, sender_: string, role_: string) => {
        //     const myMessage: MessagePlayer = { message: message_, sender: sender_, role: role_ };
        //     this.messageSubject.next(myMessage);
        // });
        this.socket.on('toPlayer', (myMessage) => {
            this.messageSubject.next(myMessage);
        });
        this.socket.on('receiveLettersReplaced', (lettersReplaced) => {
            this.lettersToReplace = lettersReplaced;
        });
    }
    sendInitiateNewGameInformation(
        playTime: number,
        isBonusRandom: boolean,
        name: string,
        gameStatus: GameStatus,
        opponentName: string,
        lettersOfCreator: Letter[],
        lettersOfJoiner: Letter[],
    ) {
        this.socket.emit('startingNewGameInfo', {
            time: playTime,
            bonusOn: isBonusRandom,
            namePlayer: name,
            mode: gameStatus,
            nameOpponent: opponentName,
            lettersCreator: lettersOfCreator,
            lettersOpponent: lettersOfJoiner,
        });
    }
    sendJoinGameInfo(name: string, indexWaitingRoom: number) {
        this.socket.emit('joinGame', {
            playerJoinName: name,
            indexInWaitingRoom: indexWaitingRoom,
        });
    }
    sendGameListNeededNotification() {
        this.socket.emit('returnListOfGames');
    }
    configureSendMessageToServer(message: string, gameStatus: number) {
        // envoyer un message a tout le monde sauf au sender
        // else if (message !== undefined && toAll !== undefined) {
        //     this.socket.emit('toAll', message.message, message.sender, message.role);
        // }
        this.socket.emit('toOpponent', message, gameStatus, this.roomNumber);
    }
    endTurn(turnsSkippedInARow: number, nextPlayerTurn: GameStatus) {
        this.socket.emit('endTurn', { roomNumber: this.roomNumber, turnSkipped: turnsSkippedInARow, playerTurnStatus: nextPlayerTurn });
    }
    cancelGame() {
        this.socket.emit('cancelWaitingGame', this.cancellationIndexes);
    }

    setAbleToJoinGame() {
        this.ableToJoin = true;
    }

    setGameMode(gameMode: number) {
        this.gameMode = gameMode;
    }

    sendLetterReplaced(lettersToReplace: string, gameStatus: number) {
        this.socket.emit('sendLettersReplaced', lettersToReplace, gameStatus);
    }
}
