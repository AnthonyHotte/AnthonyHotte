import { Component } from '@angular/core';
import { GestionTimerTourService } from '@app/services/gestion-timer-tour.service';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent {
    message: string[] = [];
    nomJoueur: string[] = ['', ''];

    difficulteFacile: boolean;
    temps: number;
    turn: number;

    constructor(private informationsJeuSolo: SoloGameInformationService, private gestionTimerTour: GestionTimerTourService) {
        this.message = this.informationsJeuSolo.message;
        this.setAttribute();
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
    }
}
