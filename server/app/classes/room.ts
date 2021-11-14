import { VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { Letter } from '@app/letter';
import { Position } from './position-tile-interface';

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
    // objectives of players
    objectivesCreator: number[];
    objectivesJoiner: number[];
    isGeneric = true;
    bonusTiles: Position[][];
    is2990: boolean = false;

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
        this.objectivesCreator = [];
        this.objectivesJoiner = [];
        this.isGeneric = true;
        this.roomIsAvailable = true;
    }
    setStartingInfo(
        time: number,
        namePlayer: string,
        socketId: string,
        bonusOn: boolean,
        lettersCreator: Letter[],
        lettersOpponent: Letter[],
        objectivesCreator: number[],
        objectivesJoiner: number[],
        bonusTiles: Position[][],
        isGameMode2990: boolean,
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
        this.objectivesCreator = objectivesCreator;
        this.objectivesJoiner = objectivesJoiner;
        this.isGeneric = false;
        this.roomIsAvailable = true;
        this.bonusTiles = [];
        this.bonusTiles = bonusTiles;
        this.is2990 = isGameMode2990;
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

    returnLettersInString(isCreator: boolean) {
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
            lettersInString += letter.letter;
            /*
            if (letter !== undefined) {
                lettersInString += letter.letter;
            }*/
        }
        return lettersInString;
    }
}
