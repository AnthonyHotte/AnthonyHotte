import { Component, OnInit } from '@angular/core';
import { SoloModeInformationsService } from '@app/services/solo-mode-informations.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar-right',
  templateUrl: './sidebar-right.component.html',
  styleUrls: ['./sidebar-right.component.scss']
})

export class SidebarRightComponent implements OnInit {

    private inscription: Subscription;
    nomJoueur: string = '';
    nomAdversaire: string = '';
    difficulteFacile: boolean;
    temps: number;
    message: string[]; 

    constructor(private informationsJeuSolo: SoloModeInformationsService) {}

    ngOnInit(): void {
      this.inscription = this.informationsJeuSolo.messageCourant.subscribe(message => this.message = message);
      this.setAttribute();
    }

    setAttribute(){
      this.nomJoueur = this.message[0];
      this.nomAdversaire = this.message[1];
      this.difficulteFacile = this.message[2] === 'true';
      this.temps = parseInt(this.message[3]);
    }

    difficultyInCharacters(){
      if(this.difficulteFacile === true){
        return "Débutant";
      } else {
        return "Expert";
      }
    }

    ngOnDestroy(){
      this.inscription.unsubscribe();
    }
}
