export class GameInfo {
    time: number;
    // maybe latter on we put all players info here
    playerName: string[];
    bonusOn: boolean;
    // true if the type of game is solo, false if it'a a multi player game
    gameSolo: boolean;
    constructor(time: number, name: string, bonusOn: boolean = false, gameSolo: boolean = false) {
        this.time = time;
        this.bonusOn = bonusOn;
        this.gameSolo = gameSolo;
        this.playerName = [name];
    }
}
