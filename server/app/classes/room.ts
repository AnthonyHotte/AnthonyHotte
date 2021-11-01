import { VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { Letter } from '@app/letter';

export class Room {
    // to handle the deconnection
    socketsId: string[];
    roomName: string;
    index: number;
    // maybe latter on we put all players info here
    playerNames: string[];
    bonusOn: boolean;
    // index of the person which is his turn to play
    startTurn: number;
    // number of skipped turn in row
    turnsSkippedInARow: number;
    // maximum time per turn
    timePerTurn: number;
    // is it an available room
    roomIsAvailable: boolean = true;
    // letters of players
    lettersCreator: Letter[];
    lettersJoiner: Letter[];
    constructor(name: string, index: number) {
        this.roomName = name;
        this.timePerTurn = VALEUR_TEMPS_DEFAULT;
        this.bonusOn = false;
        this.playerNames = ['joueur1', 'JoueurVirtuel'];
        this.socketsId = [];
        this.index = index;
        this.startTurn = Math.floor(Math.random() * 2);
        this.turnsSkippedInARow = 0;
        this.lettersCreator = [];
        this.lettersJoiner = [];
    }
    setStartingInfo(
        time: number,
        namePlayer: string,
        socketId: string,
        bonusOn: boolean = false,
        lettersCreator: Letter[],
        lettersOpponent: Letter[],
    ) {
        this.timePerTurn = time;
        this.bonusOn = bonusOn;
        this.playerNames[0] = namePlayer;
        this.socketsId.push(socketId);
        for (const letter of lettersCreator) {
            this.lettersCreator.push(letter);
        }
        for (const letter of lettersOpponent) {
            this.lettersJoiner.push(letter);
        }
    }

    cleanRoom() {
        this.timePerTurn = VALEUR_TEMPS_DEFAULT;
        this.bonusOn = false;
        this.playerNames = ['joueur1', 'JoueurVirtuel'];
        this.socketsId = [];
        this.startTurn = Math.floor(Math.random() * 2);
        this.turnsSkippedInARow = 0;
        this.lettersCreator = [];
        this.lettersJoiner = [];
    }

    setRoomOccupied() {
        this.roomIsAvailable = false;
    }

    setRoomAvailable() {
        this.roomIsAvailable = true;
    }

    returnLetters(isCreator: boolean) {
        let lettersInString = '';
        const array: Letter[] = [];
        if (isCreator) {
            for (const letter of this.lettersCreator) {
                array.push(letter);
            }
        } else {
            for (const letter of this.lettersJoiner) {
                array.push(letter);
            }
        }
        for (const letter of array) {
            if (letter !== undefined) {
                lettersInString += letter.letter;
            }
        }
        return lettersInString;
    }
}
