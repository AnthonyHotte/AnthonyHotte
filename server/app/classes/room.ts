import { VALEUR_TEMPS_DEFAULT } from '@app/constants';

export class Room {
    // to handle the deconnection
    socketsId: string[];
    roomName: string;
    index: number;
    // maybe latter on we put all players info here
    playerNames: string[];
    bonusOn: boolean;
    // true if the type of game is solo, false if it'a a multi player game
    gameSolo: boolean;
    // index of the person which is his turn to play
    turn: number;
    // number of skipped turn in row
    turnsSkippedInARow: number;
    // maximum time per turn
    timePerTurn: number;
    constructor(name: string, index: number) {
        this.roomName = name;
        this.timePerTurn = VALEUR_TEMPS_DEFAULT;
        this.bonusOn = false;
        this.gameSolo = true;
        this.playerNames = ['joueur1', 'JoueurVirtuel'];
        this.socketsId = [];
        this.index = index;
        this.turn = Math.floor(Math.random() * 2);
        this.turnsSkippedInARow = 0;
    }
    setStartingInfo(time: number, namePlayer: string, socketId: string, bonusOn: boolean = false, gameSolo: boolean = false) {
        this.timePerTurn = time;
        this.bonusOn = bonusOn;
        this.gameSolo = gameSolo;
        this.playerNames[0] = namePlayer;
        this.socketsId.push(socketId);
    }
    endTurn(reason: string) {
        if (reason === 'skip') {
            this.turnsSkippedInARow++;
        } else {
            this.turnsSkippedInARow = 0;
        }
        if (this.turn === 0) {
            this.turn = 1;
        } else {
            this.turn = 0;
        }
    }
    cleanRoom() {
        this.timePerTurn = VALEUR_TEMPS_DEFAULT;
        this.bonusOn = false;
        this.gameSolo = true;
        this.playerNames = ['joueur1', 'JoueurVirtuel'];
        this.socketsId = [];
        this.turn = Math.floor(Math.random() * 2);
        this.turnsSkippedInARow = 0;
    }
}
