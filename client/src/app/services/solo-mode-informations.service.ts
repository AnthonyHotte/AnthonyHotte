// Source : https://fireship.io/lessons/sharing-data-between-angular-components-four-methods/
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SoloModeInformationsService {

  private sourceDuMessage = new BehaviorSubject<string[]>(['Joueur','Hiruko Murakami','true','60']);
  private VALEUR_TEMPS_DEFAULT = 60;
  nom: string = 'Joueur';
  nomAdversaire: string;
  difficulteFacile: boolean = true;
  tempsDeJeu: number = this.VALEUR_TEMPS_DEFAULT;
  messageCourant = this.sourceDuMessage.asObservable();

  constructor() { }

  changerMessage(message: string[]){
    this.sourceDuMessage.next(message);
  }
}
