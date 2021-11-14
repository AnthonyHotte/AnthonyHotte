import { Injectable } from '@angular/core';
import { GameStatus } from '@app/game-status';
import { Letter } from '@app/letter';
import { Position } from '@app/position-tile-interface';
import { BehaviorSubject, Subject } from 'rxjs';
import { io } from 'socket.io-client';
// import { environment } from 'src/environments/environment';
@Injectable({
    providedIn: 'root',
})
export class SocketService {
    socket = io('http://localhost:3000');
    // socket = io(environment.serverUrl);
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
    triggeredQuit: boolean = false;
    isWordValid: BehaviorSubject<boolean>;
    boards: Position[][][];
    iswordvalid2: boolean;
    is2990: boolean;

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
        this.isWordValid = new BehaviorSubject<boolean>(false);
        this.boards = new Array(new Array(new Array()));
        this.is2990 = false;
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
        this.socket.on('sendGamesInformation', (info) => {
            this.gameLists.length = 0;
            for (let i = 0; i < info.games.length; i++) {
                this.gameLists.push(['name', 'bonus', 'time', 'lettersCreator', 'lettersJoiner', 'objectivesCreator', 'objectivesJoiner', 'is2990']);
                this.gameLists[i][0] = info.games[i][0]; // player name of who is the game initiator
                this.gameLists[i][1] = info.games[i][1]; // is random bonus on
                this.gameLists[i][2] = info.games[i][2]; // time per turn
                this.gameLists[i][3] = info.games[i][3]; // letters of creator
                this.gameLists[i][4] = info.games[i][4]; // letters of joiner
                this.gameLists[i][5] = info.games[i][5]; // objectives creator
                this.gameLists[i][6] = info.games[i][6]; // objectives joiner
                this.gameLists[i][7] = info.games[i][7]; // 2990 or not
                this.boards.push([]);
                this.boards[i] = info.boards[i]; // bonusTiles of created games
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

        this.socket.on('wordValidation', (wordIsValid) => {
            // this.isWordValidationFinished = true;
            this.iswordvalid2 = wordIsValid;
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
        objectivesOfCreator: number[],
        objectivesOfJoiner: number[],
        bonusTiles: Position[][],
        is2990: boolean,
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
            objectivesCreator: objectivesOfCreator,
            objectivesJoiner: objectivesOfJoiner,
            bonus: bonusTiles,
            isGameMode2990: is2990,
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
        if (this.cancellationIndexes[0] >= 0 && this.cancellationIndexes[1] >= 0) {
            this.socket.emit('cancelWaitingGame', this.cancellationIndexes);
            const INEXISTING_ROOM = -1;
            this.cancellationIndexes = [INEXISTING_ROOM, INEXISTING_ROOM];
        }
    }

    setAbleToJoinGame() {
        this.ableToJoin = true;
    }

    async validateWord(wordCreated: string): Promise<boolean> {
        return new Promise<boolean>((resolve) => {
            this.socket.emit('validateWordOnServer', wordCreated, (response: boolean) => {
                resolve(response);
            });
        }).then((res: boolean) => {
            return res;
        });
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
        this.socket.emit('gameFinished', this.roomNumber);
    }

    handleDisconnect() {
        this.socket.disconnect();
    }
}
