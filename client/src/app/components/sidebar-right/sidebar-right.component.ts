import { Component, OnInit, OnDestroy } from '@angular/core';
import { GestionTimerTourService } from '@app/services/gestion-timer-tour.service';
import { SoloModeInformationsService } from '@app/services/solo-mode-informations.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sidebar-right',
    templateUrl: './sidebar-right.component.html',
    styleUrls: ['./sidebar-right.component.scss'],
})
export class SidebarRightComponent implements OnInit, OnDestroy {
    nomJoueur: string[] = ['', ''];
    // nomAdversaire: string = '';
    difficulteFacile: boolean;
    temps: number;
    message: string[];
    turn: number;
    private inscription: Subscription;

    constructor(private informationsJeuSolo: SoloModeInformationsService, private gestionTimerTour: GestionTimerTourService) {}

    ngOnInit(): void {
        this.inscription = this.informationsJeuSolo.messageCourant.subscribe((message) => (this.message = message));
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

    ngOnDestroy() {
        this.inscription.unsubscribe();
    }
}
