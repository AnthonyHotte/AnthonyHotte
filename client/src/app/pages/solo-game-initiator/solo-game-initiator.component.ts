import { Component, OnInit } from '@angular/core';
// eslint-disable-next-line no-restricted-imports
import { fileReaderFunction } from '../../useful-function';
// eslint-disable-next-line no-restricted-imports
import { VALEUR_TEMPS_DEFAULT, LONGUEURNOMMAX, VERIFICATION_PRESENCE, LENGTHWORDVALIDATION } from '../../constants';

@Component({
    selector: 'app-solo-game-initiator',
    templateUrl: './solo-game-initiator.component.html',
    styleUrls: ['./solo-game-initiator.component.scss'],
})
export class SoloGameInitiatorComponent implements OnInit {
    nomTemporaire: string = 'Joueur';
    nom: string = 'Joueur';
    nomAdversaire: string;
    idNomAdversaire: number;
    nomEstValide: boolean = true;
    listeDesInsultes = fileReaderFunction('../../../assets/insulte.txt');
    tempsDeJeu: number = VALEUR_TEMPS_DEFAULT;
    private difficulteFacile: boolean = true;

    ngOnInit(): void {
        this.assignerNomAdversaire();
        this.inscription = this.informations.messageCourant.subscribe(message => this.message = message);
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
        let placeInName = 0;
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
            this.listeDesInsultes.search(temp.substring(placeInName++, LENGTHWORDVALIDATION)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(LENGTHWORDVALIDATION, placeInName * LENGTHWORDVALIDATION)) !== VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName++ * LENGTHWORDVALIDATION, placeInName * LENGTHWORDVALIDATION)) !==
                VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName++ * LENGTHWORDVALIDATION, placeInName * LENGTHWORDVALIDATION)) !==
                VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName++ * LENGTHWORDVALIDATION, placeInName * LENGTHWORDVALIDATION)) !==
                VERIFICATION_PRESENCE &&
            this.listeDesInsultes.search(temp.substring(placeInName * LENGTHWORDVALIDATION)) !== VERIFICATION_PRESENCE
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
            this.informations.changerMessage([this.nom, this.nomAdversaire, this.difficulteFacile.toString(), this.tempsDeJeu.toString()]);
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
    getTempsDeJeu() {
        return this.tempsDeJeu;
    }

    ngOnDestroy(){
        this.inscription.unsubscribe();
    }
}
