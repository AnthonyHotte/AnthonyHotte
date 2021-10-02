import { Injectable } from '@angular/core';
import { VALEUR_TEMPS_DEFAULT } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class CommunicationTextBoxSoloGameInitiatorService {
    nomTemporaire = 'Joueur';
    nom = 'Joueur';
    tnomAdversaire = '';
    idNomAdversaire = 0;
    nomEstValide = true;
    tempsDeJeu = VALEUR_TEMPS_DEFAULT;
    difficulteFacile = true;
}
