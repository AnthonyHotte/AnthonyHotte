import { Component, ViewChild } from '@angular/core';
import { LONGUEURNOMMAX, VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { LetterService } from '@app/services/letter.service';
import { InitiateGameTypeService } from '@app/services/initiate-game-type.service';
import { SocketService } from '@app/services/socket.service';
import { TileScramblerService } from '@app/services/tile-scrambler.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-solo-game-initiator',
    templateUrl: './solo-game-initiator.component.html',
    styleUrls: ['./solo-game-initiator.component.scss'],
})
export class SoloGameInitiatorComponent {
    @ViewChild('container justified') divPage!: HTMLDivElement;
    @ViewChild('waiting') waitingRoom!: HTMLDivElement;
    temporaryName: string;
    name: string;
    opponentName: string;
    idNameOpponent: number;
    nameIsValid: boolean;
    playTime: number;
    easyDifficulty: boolean;

    isBonusRandom = false;

    constructor(
        // private informations: SoloGameInformationService,
        public initiateTypeGame: InitiateGameTypeService,
        private socketService: SocketService,
        private letterService: LetterService,
        private tileScrambler: TileScramblerService,
        private timeManager: TimerTurnManagerService,
    ) {
        this.temporaryName = 'Joueur';
        this.name = 'Joueur';
        this.opponentName = '';
        this.idNameOpponent = 0;
        this.nameIsValid = true;
        this.playTime = VALEUR_TEMPS_DEFAULT;
        this.easyDifficulty = true;
        // this.message = [];
    }
    startGame() {
        this.setName();
        this.setTime();
        this.scrambleBonus();
        this.sendTime();
    }
    showWaitingRoom() {
        this.divPage.style.display = 'none';
        this.waitingRoom.style.display = 'block';
    }

    sendTime() {
        this.socketService.sendInitiateGameInformation(this.playTime);
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
        this.assignOpponentName();
        this.switchOpponentName(temp);
        if (temp.length > LONGUEURNOMMAX || temp === '') {
            this.nameIsValid = false;
        } else if (EXPRESSION.test(temp)) {
            this.nameIsValid = true;
        } else {
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
}
