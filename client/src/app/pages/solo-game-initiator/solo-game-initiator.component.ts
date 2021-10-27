import { Component } from '@angular/core';
import { LONGUEURNOMMAX, VALEUR_TEMPS_DEFAULT } from '@app/constants';
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
    startingNewGame = false;

    isBonusRandom = false;

    constructor(
        private socketService: SocketService,
        private letterService: LetterService,
        private tileScrambler: TileScramblerService,
        private timeManager: TimerTurnManagerService,
        private messageService: MessageService,
    ) {
        this.temporaryName = 'Joueur';
        this.name = 'Joueur';
        this.assignOpponentName();
        this.idNameOpponent = 0;
        this.nameIsValid = true;
        this.playTime = VALEUR_TEMPS_DEFAULT;
        this.easyDifficulty = true;
        this.messageService.gameStartingInfoSubscribe();
    }
    joinGame() {
        this.setName();
        this.socketService.sendJoinGameInfo(this.name);
    }
    startNewGame() {
        this.startingNewGame = true;
        this.setName();
        this.setTime();
        this.scrambleBonus();
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
        this.socketService.sendInitiateNewGameInformation(
            this.playTime,
            this.isBonusRandom,
            this.name,
            this.timeManager.gameStatus,
            this.opponentName,
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
