import { Component, HostListener, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Dictionary } from '@app/classes/dictionary';
import { TileMap } from '@app/classes/grid-special-tile';
import { PopUpData } from '@app/classes/pop-up-data';
import { PopUpComponent } from '@app/components/pop-up/pop-up.component';
import { LONGUEURNOMMAX, TIMETOWAITFORVALIDATION, VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { Position } from '@app/position-tile-interface';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { IndexWaitingRoomService } from '@app/services/index-waiting-room.service';
import { LetterService } from '@app/services/letter.service';
import { MessageService } from '@app/services/message.service';
import { OpponentNameService } from '@app/services/opponent-name.service';
import { SocketService } from '@app/services/socket.service';
import { SoloOpponent2Service } from '@app/services/solo-opponent2.service';
import { TileScramblerService } from '@app/services/tile-scrambler.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-solo-game-initiator',
    templateUrl: './solo-game-initiator.component.html',
    styleUrls: ['./solo-game-initiator.component.scss'],
})
export class SoloGameInitiatorComponent {
    @ViewChild('listDict') listDict: HTMLDivElement;
    temporaryName: string;
    name: string;
    opponentName: string;
    nameIsValid: boolean;
    playTime: number;
    easyDifficulty: boolean;
    dictionaryList: Dictionary[];
    indexDictionaryNumber: number;
    validationDictionaryMessage: string;
    startingNewGame = false;
    isDictionaryValid: boolean;
    // expertmode = false; // a enlever peut-etre
    isBonusRandom = false;
    showAdvancedParameters = false;

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
        private soloopponent2: SoloOpponent2Service,
        private opponentNameService: OpponentNameService,
    ) {
        this.dictionaryList = [];
        this.initiateSubscription();
        this.isDictionaryValid = false;
        this.validationDictionaryMessage = 'Le dictionnaire de base est chargé.';
        this.indexDictionaryNumber = 0;
        this.temporaryName = 'Joueur';
        this.name = 'Appuyez sur la validation pour valider votre nom';
        this.nameIsValid = false;
        this.playTime = VALEUR_TEMPS_DEFAULT;
        this.easyDifficulty = true;
        this.messageService.gameStartingInfoSubscribe();
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler() {
        this.socketService.handleDisconnect();
    }

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: { preventDefault: () => void }) {
        event.preventDefault();
    }
    initiateSubscription() {
        this.communicationService.getDictionaryList().subscribe((result: Dictionary[]) => {
            result.forEach((res) => {
                this.dictionaryList.push(res);
            });
        });
    }
    joinGame() {
        this.setName();
        this.timeManager.timePerTurn = parseInt(this.socketService.gameLists[this.indexWaitingRoomService.getIndex()][2], 10); // timePerTurn
        this.socketService.setGameMode(this.getGameStatus());
        this.socketService.sendJoinGameInfo(this.name, this.indexWaitingRoomService.getIndex());
    }
    startNewGame() {
        this.dictionaryService.getDictionary();
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
            this.letterService.players[0].objectives,
            this.letterService.players[1].objectives,
            bonusTiles,
            this.socketService.is2990,
        );
    }

    assignOpponentName(nameEntered: string) {
        this.opponentName = this.opponentNameService.getOpponentName(nameEntered, this.soloopponent2.expertmode);
        this.letterService.players[1].name = this.opponentName;
    }

    verifyNames() {
        const EXPRESSION = /^[A-Za-z]+$/;
        const temp: string = this.temporaryName.split(' ').join('').toLocaleLowerCase();
        if (!this.startingNewGame) {
            this.assignOpponentName(temp);
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
    setName() {
        this.verifyNames();
        if (this.nameIsValid) {
            this.name = this.temporaryName;
        } else {
            this.name = 'Essayez de nouveau...';
            if (this.getGameStatus() === 1) {
                this.name = 'Entrez votre nom de nouveau, vous aviez fait une erreur...';
            }
        }
        this.letterService.players[0].name = this.name;
    }

    setTime() {
        this.timeManager.timePerTurn = this.playTime;
    }

    nameValidityInChar() {
        return this.nameIsValid ? 'valide' : 'invalide';
    }
    setRandomBonus(activated: boolean) {
        this.isBonusRandom = activated;
    }

    setExpertMode(expert: boolean) {
        this.easyDifficulty = !expert;
        this.soloopponent2.setExpertMode(expert);
        this.assignOpponentName(this.letterService.players[0].name);
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
    async validateDictionaryNumber() {
        this.communicationService.getDictionaryList().subscribe((result: Dictionary[]) => {
            this.dictionaryList = [];
            result.forEach((res) => {
                this.dictionaryList.push(res);
            });
        });
        this.validationDictionaryMessage = 'Validation du dictionnaire en cours... Veuillez patienter.';
        setTimeout(() => {
            this.dictionnaryValidation();
        }, TIMETOWAITFORVALIDATION);
    }
    dictionnaryValidation() {
        if (this.indexDictionaryNumber < 0 || this.indexDictionaryNumber >= this.dictionaryList.length) {
            this.validationDictionaryMessage = 'La vérification a échouée...';
            this.isDictionaryValid = false;
        } else {
            this.validationDictionaryMessage = 'Le dictionnaire choisi, ' + this.dictionaryList[this.indexDictionaryNumber].title + ' est valide!';
            this.dictionaryService.indexDictionary = this.indexDictionaryNumber;
            this.isDictionaryValid = true;
        }
    }
}
