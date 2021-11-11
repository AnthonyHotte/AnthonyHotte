import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from '@app/classes/dictionary';
import { TileMap } from '@app/classes/grid-special-tile';
import { PopUpData } from '@app/classes/pop-up-data';
import { PopUpComponent } from '@app/components/pop-up/pop-up.component';
import { LONGUEURNOMMAX, VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { Position } from '@app/position-tile-interface';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { IndexWaitingRoomService } from '@app/services/index-waiting-room.service';
import { LetterService } from '@app/services/letter.service';
import { MessageService } from '@app/services/message.service';
import { SocketService } from '@app/services/socket.service';
import { TileScramblerService } from '@app/services/tile-scrambler.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-solo-game-initiator',
    templateUrl: './solo-game-initiator.component.html',
    styleUrls: ['./solo-game-initiator.component.scss'],
})
export class SoloGameInitiatorComponent {
    temporaryName: string;
    name: string;
    opponentName: string;
    idNameOpponent: number;
    nameIsValid: boolean;
    playTime: number;
    easyDifficulty: boolean;
    dictionaryList: Dictionary[];
    indexDictionaryNumber: number;
    validationDictionaryMessage: string;
    startingNewGame = false;
    isDictionaryValid: boolean;

    isBonusRandom = false;

    constructor(
        private socketService: SocketService,
        private letterService: LetterService,
        private tileScrambler: TileScramblerService,
        private timeManager: TimerTurnManagerService,
        private messageService: MessageService,
        private indexWaitingRoomService: IndexWaitingRoomService,
        private dialog: MatDialog,
        private communicationService: CommunicationService,
        private dictionaryService: DictionaryService,
    ) {
        this.dictionaryList = [];
        this.communicationService.getDictionaryList().subscribe((result: Dictionary[]) => {
            result.forEach((res) => {
                this.dictionaryList.push(res);
            });
        });
        this.isDictionaryValid = true;
        this.validationDictionaryMessage = "l'index est valide!!!";
        this.indexDictionaryNumber = 0;
        this.temporaryName = 'Joueur';
        this.name = 'Joueur';
        this.assignOpponentName();
        this.idNameOpponent = 0;
        this.nameIsValid = true;
        this.playTime = VALEUR_TEMPS_DEFAULT;
        this.easyDifficulty = true;
        this.messageService.gameStartingInfoSubscribe();
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler() {
        this.socketService.handleDisconnect();
    }

    joinGame() {
        this.setName();
        this.timeManager.timePerTurn = parseInt(this.socketService.gameLists[this.indexWaitingRoomService.getIndex()][2], 10); // timePerTurn
        this.socketService.setGameMode(this.getGameStatus());
        this.socketService.sendJoinGameInfo(this.name, this.indexWaitingRoomService.getIndex());
    }
    startNewGame() {
        this.startingNewGame = true;
        this.setName();
        this.setTime();
        this.scrambleBonus();
        this.socketService.setGameMode(this.getGameStatus());
        this.sendNewGameStartInfo();
    }
    getGameStatus() {
        return this.timeManager.gameStatus;
    }
    getGameStatusInString() {
        if (this.timeManager.gameStatus === 2) {
            // mode solo
            return 'solo';
        } else {
            // multi player game
            return 'multi player';
        }
    }

    sendNewGameStartInfo() {
        const bonusTiles: Position[][] = [];
        bonusTiles.push(TileMap.gridMap.tileMap.get('DoubleWord') as Position[]);
        bonusTiles.push(TileMap.gridMap.tileMap.get('DoubleLetter') as Position[]);
        bonusTiles.push(TileMap.gridMap.tileMap.get('TripleWord') as Position[]);
        bonusTiles.push(TileMap.gridMap.tileMap.get('TripleLetter') as Position[]);

        this.socketService.sendInitiateNewGameInformation(
            this.playTime,
            this.isBonusRandom,
            this.name,
            this.timeManager.gameStatus,
            this.opponentName,
            this.letterService.players[0].allLettersInHand,
            this.letterService.players[1].allLettersInHand,
            bonusTiles,
        );
    }

    assignOpponentName() {
        const NUMBER_OF_NAMES = 3;
        switch ((this.idNameOpponent = Math.floor(Math.random() * NUMBER_OF_NAMES) + 1)) {
            case 1:
                this.opponentName = 'Haruki Murakami';
                break;
            case 2:
                this.opponentName = 'Daphne du Maurier';
                break;
            default:
                this.opponentName = 'Jane Austen';
        }
        this.letterService.players[1].name = this.opponentName;
    }

    verifyNames() {
        const EXPRESSION = /^[A-Za-z]+$/;
        const temp: string = this.temporaryName.split(' ').join('').toLocaleLowerCase();
        if (!this.startingNewGame) {
            this.assignOpponentName();
            this.switchOpponentName(temp);
        }
        if (temp.length > LONGUEURNOMMAX || temp === '') {
            this.nameIsValid = false;
        } else if (EXPRESSION.test(temp)) {
            this.nameIsValid = true;
        } else {
            this.nameIsValid = false;
        }
        if (!this.verifyNameIsNotSameAsRoomCreator() && this.getGameStatus() === 1) {
            this.nameIsValid = false;
        }
    }
    switchOpponentName(temp: string) {
        if (temp === this.opponentName.split(' ').join('').toLocaleLowerCase()) {
            switch (this.idNameOpponent) {
                case 1:
                    this.opponentName = 'Daphne du Maurier';

                    break;
                case 2:
                    this.opponentName = 'Jane Austen';

                    break;
                default:
                    this.opponentName = 'Haruki Murakami';
            }
            this.letterService.players[1].name = this.opponentName;
        }
    }
    setName() {
        this.verifyNames();
        if (this.nameIsValid) {
            this.name = this.temporaryName;
        } else {
            this.name = 'Joueur';
        }
        this.letterService.players[0].name = this.name;
    }

    setTime() {
        this.timeManager.timePerTurn = this.playTime;
    }

    nameValidityInChar() {
        if (this.nameIsValid) {
            return 'valide';
        } else return 'invalide';
    }
    setRandomBonus(activated: boolean) {
        this.isBonusRandom = activated;
    }
    scrambleBonus() {
        if (this.isBonusRandom) {
            this.tileScrambler.scrambleTiles();
        }
    }
    returnIsGameToBeJoined() {
        return this.socketService.ableToJoin;
    }
    createPopUp() {
        const dialogData = new PopUpData(
            'Titre en lien avec des problemes de connexion',
            'Texte Avertissant de la non possibilité de rejoindre une partie',
        );
        this.dialog.open(PopUpComponent, {
            maxWidth: '400px',
            closeOnNavigation: true,
            data: dialogData,
        });
    }

    verifyNameIsNotSameAsRoomCreator() {
        return this.socketService.nameOfRoomCreator.toLowerCase() !== this.temporaryName.toLowerCase();
    }

    returnNameOfCreator() {
        return this.socketService.nameOfRoomCreator;
    }
    validateDictionaryNumber() {
        if (this.indexDictionaryNumber < 0 || this.indexDictionaryNumber >= this.dictionaryList.length) {
            this.validationDictionaryMessage = "l'index est invalide... il doit etre dans la liste, essayer de nouveau.";
            this.isDictionaryValid = false;
        } else {
            this.validationDictionaryMessage = "l'index est valide!!!";
            this.dictionaryService.indexDictionary = this.indexDictionaryNumber;
            this.isDictionaryValid = true;
        }
    }
}
