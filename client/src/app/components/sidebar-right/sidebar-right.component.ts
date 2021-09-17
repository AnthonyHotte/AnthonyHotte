import { Component, OnInit } from '@angular/core';
import { GestionTimerTourService } from '@app/services/gestion-timer-tour.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { Subscription } from 'rxjs';
import { SoloPlayerService } from '@app/services/solo-player.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements OnInit {
    messagePlayer: string;
    opponentMessage: string;
    subscriptionPlayer: Subscription;
    subscriptionOpponent: Subscription;
    message: string[] = [];
    nomJoueur: string[] = ['', ''];

    difficulteFacile: boolean;
    temps: number;
    turn: number;

    constructor(
        private informationsJeuSolo: SoloGameInformationService,
        private gestionTimerTour: GestionTimerTourService,
        private soloPlayer: SoloPlayerService,
        private soloOpponent: SoloOpponentService,
    ) {
        this.message = this.informationsJeuSolo.message;
        this.setAttribute();
    }

    ngOnInit() {
        this.subscriptionPlayer = this.soloPlayer.currentMessage.subscribe((messagePlayer) => (this.messagePlayer = messagePlayer));
        this.subscriptionOpponent = this.soloOpponent.currentMessage.subscribe((opponentMessage) => (this.opponentMessage = opponentMessage));
    }

    setAttribute() {
        this.nomJoueur[0] = this.message[0];
        this.nomJoueur[1] = this.message[1];
        this.difficulteFacile = this.message[2] === 'true';
        this.temps = parseInt(this.message[3], 10);
        this.gestionTimerTour.initiateGame();
        this.turn = this.gestionTimerTour.turn;
    }
    difficultyInCharacters() {
        if (this.difficulteFacile === true) {
            return 'Débutant';
        } else {
            return 'Expert';
        }
    }

    endTurn() {
        this.gestionTimerTour.endTurn();
        this.turn = this.gestionTimerTour.turn;
        if (this.turn === 0) {
            this.soloPlayer.changeTurn(this.turn.toString());
        } else {
            this.soloOpponent.changeTurn(this.turn.toString());
        }
    }
}
