import { Component } from '@angular/core';
import { LONGUEURNOMMAX, VALEUR_TEMPS_DEFAULT } from '@app/constants';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { LetterService } from '@app/services/letter.service';

@Component({
    selector: 'app-solo-game-initiator',
    templateUrl: './solo-game-initiator.component.html',
    styleUrls: ['./solo-game-initiator.component.scss'],
})
export class SoloGameInitiatorComponent {
    message: string[] = [];

    temporaryName: string;
    name: string;
    opponentName: string;
    idNameOpponent: number;
    nameIsValid: boolean;
    playTime: number;
    easyDifficulty: boolean = true;

    constructor(private informations: SoloGameInformationService, private letterService: LetterService) {
        this.message = [];

        this.temporaryName = 'Joueur';
        this.name = 'Joueur';
        this.opponentName = '';
        this.idNameOpponent = 0;
        this.nameIsValid = true;
        this.playTime = VALEUR_TEMPS_DEFAULT;
        this.easyDifficulty = true;
    }

    sendMessage(): void {
        // send message to subscribers via observable subject
        this.assignOpponentName();
        const difficultyEasyString = this.easyDifficulty ? 'true' : 'false';
        this.message.push(this.name, this.opponentName, difficultyEasyString, String(this.playTime));
        this.informations.sendMessage(this.message);
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
                    this.letterService.players[1].name = this.opponentName;
                    break;
                case 2:
                    this.opponentName = 'Jane Belmont';
                    this.letterService.players[1].name = this.opponentName;
                    break;
                default:
                    this.opponentName = 'Haruki MacDonald';
                    this.letterService.players[1].name = this.opponentName;
            }
        }
    }
    setName() {
        this.verifyNames();
        if (this.nameIsValid) {
            this.name = this.temporaryName;
            this.letterService.players[0].name = this.temporaryName;
        } else {
            this.name = 'Joueur';
        }
    }
    nameValidityInChar() {
        if (this.nameIsValid) {
            return 'valide';
        } else return 'invalide';
    }
    setDifficulte(easy: boolean) {
        this.easyDifficulty = easy;
    }
    getDifficulte() {
        if (this.easyDifficulty === true) {
            return 'Débutant';
        } else {
            return 'Expert';
        }
    }
}
