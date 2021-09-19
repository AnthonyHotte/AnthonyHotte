import { Component } from '@angular/core';
// LENGTHWORDVALIDATION
import { LONGUEURNOMMAX, VALEUR_TEMPS_DEFAULT, VERIFICATION_PRESENCE } from '@app/constants';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { UsefullFunctionService } from '@app/services/usefull-function.service';
@Component({
    selector: 'app-solo-game-initiator',
    templateUrl: './solo-game-initiator.component.html',
    styleUrls: ['./solo-game-initiator.component.scss'],
})
export class SoloGameInitiatorComponent {
    message: string[] = [];

    nomTemporaire: string;
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

        this.nomTemporaire = 'Joueur';
        this.nom = 'Joueur';
        this.nomAdversaire = '';
        this.idNomAdversaire = 0;
        this.nomEstValide = true;
        this.listeDesInsultes = this.usefullFunction.fileReaderFunction('../../../assets/insulte.txt');
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
        // let placeInName = 0;
        const temp: string = this.nomTemporaire.split(' ').join('').toLocaleLowerCase();
        this.assignerNomAdversaire();
        if (this.nomTemporaire.split(' ').join('').toLocaleLowerCase() === this.nomAdversaire.split(' ').join('').toLocaleLowerCase()) {
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
        } else if (this.nomTemporaire.split(' ').join('') === '') {
            this.nomEstValide = false;
        } else if (this.nomTemporaire.length > LONGUEURNOMMAX) {
            this.nomEstValide = false;
        } else if (
            this.listeDesInsultes.search(temp.substring(0, 3)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(4, 7)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(8, 10)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(11, 13)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(14, 16)) !== VERIFICATION_PRESENCE

            /*
            this.listeDesInsultes.search(temp.substring(placeInName++, LENGTHWORDVALIDATION)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName++ * LENGTHWORDVALIDATION, placeInName * LENGTHWORDVALIDATION)) !==
                VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName++ * LENGTHWORDVALIDATION, placeInName * LENGTHWORDVALIDATION)) !==
                VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName++ * LENGTHWORDVALIDATION, placeInName * LENGTHWORDVALIDATION)) !==
                VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName++ * LENGTHWORDVALIDATION, placeInName * LENGTHWORDVALIDATION)) !==
                VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName * LENGTHWORDVALIDATION)) !== VERIFICATION_PRESENCE*/
        ) {
            this.nomEstValide = false;
        } else {
            this.nomEstValide = true;
        }
    }
    setNom() {
        this.verifierNoms();
        if (this.nomEstValide) {
            this.nom = this.nomTemporaire;
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
