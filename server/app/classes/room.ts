export class Room {
    // to handle the deconnection
    socketsId: string[];
    roomName: string;
    time: number;
    index: number;
    // maybe latter on we put all players info here
    playerNames: string[];
    bonusOn: boolean;
    // true if the type of game is solo, false if it'a a multi player game
    gameSolo: boolean;
    constructor(name: string, index: number) {
        this.roomName = name;
        this.time = 0;
        this.bonusOn = false;
        this.gameSolo = true;
        this.playerNames = ['joueur1', 'JoueurVirtuel'];
        this.socketsId = [];
        this.index = index;
    }
    setStartingInfo(time: number, name: string, socketId: string, bonusOn: boolean = false, gameSolo: boolean = false) {
        this.time = time;
        this.bonusOn = bonusOn;
        this.gameSolo = gameSolo;
        this.playerNames.push(name);
        this.playerNames.push(socketId);
    }
}
