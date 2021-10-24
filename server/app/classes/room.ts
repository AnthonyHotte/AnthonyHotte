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
    startTurn: number;
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
        this.startTurn = Math.floor(Math.random() * 2);
        this.turnsSkippedInARow = 0;
    }
    setStartingInfo(time: number, namePlayer: string, socketId: string, bonusOn: boolean = false, gameSolo: boolean = false) {
        this.timePerTurn = time;
        this.bonusOn = bonusOn;
        this.gameSolo = gameSolo;
        this.playerNames[0] = namePlayer;
        this.socketsId.push(socketId);
    }

    cleanRoom() {
        this.timePerTurn = VALEUR_TEMPS_DEFAULT;
        this.bonusOn = false;
        this.gameSolo = true;
        this.playerNames = ['joueur1', 'JoueurVirtuel'];
        this.socketsId = [];
        this.startTurn = Math.floor(Math.random() * 2);
        this.turnsSkippedInARow = 0;
    }
}
