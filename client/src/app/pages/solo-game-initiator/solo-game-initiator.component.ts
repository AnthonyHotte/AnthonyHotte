import { Component } from '@angular/core';
import { UsefullFunctionService } from '@app/services/usefull-function.service';
import { VALEUR_TEMPS_DEFAULT, LONGUEURNOMMAX } from '@app/constants';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
// LENGTHWORDVALIDATION

@Component({
    selector: 'app-solo-game-initiator',
    templateUrl: './solo-game-initiator.component.html',
    styleUrls: ['./solo-game-initiator.component.scss'],
})
export class SoloGameInitiatorComponent {
    message: string[] = [];

    // nomTemporaire: string;
    nom: string;
    nomAdversaire: string;
    idNomAdversaire: number;
    nomEstValide: boolean;
    listeDesInsultes: string;
    tempsDeJeu: number;
    difficulteFacile: boolean = true;
    constructor(
        private informations: SoloGameInformationService,
        private usefullFunction: UsefullFunctionService, // private toTextBox: CommunicationTextBoxSoloGameInitiatorService,
    ) {
        this.message = [];

        // this.nomTemporaire = 'Joueur';
        this.nom = 'Joueur';
        this.nomAdversaire = '';
        this.idNomAdversaire = 0;
        this.nomEstValide = true;
        this.listeDesInsultes = this.usefullFunction.fileReaderFunction('@src/assets/insulte.txt');
        this.tempsDeJeu = VALEUR_TEMPS_DEFAULT;
        this.difficulteFacile = true;
    }

    sendMessage(): void {
        // send message to subscribers via observable subject
        this.assignerNomAdversaire();
        const difficulteFacileString = this.difficulteFacile ? 'true' : 'false';
        this.message.push(this.nom, this.nomAdversaire, difficulteFacileString, String(this.tempsDeJeu));
        this.informations.sendMessage(this.message);
    }

    assignerNomAdversaire() {
        const NOMBRE_DE_NOMS = 3;
        switch ((this.idNomAdversaire = Math.floor(Math.random() * NOMBRE_DE_NOMS) + 1)) {
            case 1:
                this.nomAdversaire = 'Haruki Murakami';
                break;
            case 2:
                this.nomAdversaire = 'Daphne du Maurier';
                break;
            default:
                this.nomAdversaire = 'Jane Austen';
        }
    }

    verifierNoms() {
        const EXPRESSION = /^[A-Za-z]+$/;
        const temp: string = this.nomTemporaire.split(' ').join('').toLocaleLowerCase();
        this.assignerNomAdversaire();
        if (temp === this.nomAdversaire.split(' ').join('').toLocaleLowerCase()) {
            switch (this.idNomAdversaire) {
                case 1:
                    this.nomAdversaire = 'Daphne du Maurier';
                    break;
                case 2:
                    this.nomAdversaire = 'Jane Austen';
                    break;
                default:
                    this.nomAdversaire = 'Haruki Murakami';
            }
        } else if (temp === '') {
            this.nomEstValide = false;
        } else if (temp.length > LONGUEURNOMMAX) {
            this.nomEstValide = false;
        } else if (!EXPRESSION.test(temp)) {
            this.nomEstValide = false;
        } else {
            this.nomEstValide = false;
        }
    }
    setNom() {
        this.verifierNoms();
        if (this.nomEstValide) {
            // this.nom = this.nomTemporaire;
            return this.nom;
        } else {
            return 'Ce nom est invalide! Recommencez...';
        }
    }
    afficherValiditeEnCaracteres() {
        if (this.nomEstValide) {
            return 'valide';
        } else return 'invalide';
    }
    setDifficulte(facile: boolean) {
        this.difficulteFacile = facile;
    }
    getDifficulte() {
        if (this.difficulteFacile === true) {
            return 'Débutant';
        } else {
            return 'Expert';
        }
    }
}
