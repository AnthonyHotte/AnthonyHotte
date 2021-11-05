import { Injectable } from '@angular/core';
import { GameStatus } from '@app/game-status';
import { Letter } from '@app/letter';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket = io(environment.serverUrl);
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
    currentEndGameValue: Observable<boolean>; // to be observed by finishGameService
    updateOfEndGameValue = new BehaviorSubject(false); // to be observed by finishGameService
    triggeredQuit: boolean = false;
    isWordValid: BehaviorSubject<boolean>;

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
        const unexistingRooms = -1;
        this.cancellationIndexes = [unexistingRooms, unexistingRooms]; // room number and waiting room number
        this.currentEndGameValue = this.updateOfEndGameValue.asObservable();
        this.isWordValid = new BehaviorSubject<boolean>(false);
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

        this.socket.on('gameIsFinished', () => {
            this.updateOfEndGameValue.next(true);
        });
        /*
        this.socket.on('wordValidation', (wordIsValid) => {
            this.isWordValidationFinished = true;
            this.wordIsValid = wordIsValid === 'true' ? true : false;
        });
        */
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
        if (gameStatus === 2 && this.cancellationIndexes[0] >= 0 && this.cancellationIndexes[1] >= 0) {
            this.cancelGame();
        }
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
        if (gameStatus !== 2) {
            this.socket.emit('toOpponent', message, gameStatus, this.roomNumber);
        }
    }

    cancelGame() {
        this.socket.emit('cancelWaitingGame', this.cancellationIndexes);
        const INEXISTING_ROOM = -1;
        this.cancellationIndexes = [INEXISTING_ROOM, INEXISTING_ROOM];
    }

    setAbleToJoinGame() {
        this.ableToJoin = true;
    }

    validateWord(wordCreated: string) {
        this.socket.emit('validateWordOnServer', wordCreated);
    }
    setGameMode(gameMode: number) {
        this.gameMode = gameMode;
    }

    sendLetterReplaced(lettersToReplace: string, gameStatus: number) {
        if (gameStatus !== 2) {
            this.socket.emit('sendLettersReplaced', lettersToReplace, gameStatus, this.roomNumber);
        }
    }

    finishedGameMessageTransmission() {
        this.triggeredQuit = true;
        this.socket.emit('gameFinished', this.roomNumber);
    }

    handleDisconnect() {
        this.socket.disconnect();
    }
}
