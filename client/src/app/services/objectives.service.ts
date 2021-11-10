import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    static objectives = new ObjectivesService();
    objectiveMap: Map<number, string>;
    objectivePoint: Map<number, number>;
    constructor() {
        this.objectiveMap = new Map<number, string>();
        this.objectivePoint = new Map<number, number>();
        const FOUR = 4;
        const FIVE = 5;
        const SIX = 6;
        const SEVEN = 7;
        const EIGHT = 8;
        const TEN = 10;
        const TWELVE = 12;
        const FIFTEEN = 15;
        const TWENTY = 20;
        this.objectiveMap = new Map<number, string>();
        this.objectiveMap.set(0, 'Utliser au moins 6 lettres différentes dans un seul placement (sur le jeu ou en main)');
        this.objectiveMap.set(1, "Placer 3 mots de suite sans avoir un bonus d'une case bonus");
        this.objectiveMap.set(2, 'Créer un mot en utilisant aucune consonne provenant de la main');
        this.objectiveMap.set(3, 'Placer un mot 5 tour de suite sans échanger ou passer son tour');
        this.objectiveMap.set(FOUR, 'Faites un placement de 20 points ou plus avec moins de 3 lettres provenant de la main');
        this.objectiveMap.set(FIVE, 'Placer un mot qui touche à un des coins');
        this.objectiveMap.set(SIX, "Placer des lettres de bord en bord d'une lettre déjà en jeu pour former un mot");
        this.objectiveMap.set(SEVEN, 'Placer un palindrome');
        this.objectivePoint.set(0, FIFTEEN);
        this.objectivePoint.set(1, TWELVE);
        this.objectivePoint.set(2, TEN);
        this.objectivePoint.set(3, TEN);
        this.objectivePoint.set(FOUR, EIGHT);
        this.objectivePoint.set(FIVE, FIFTEEN);
        this.objectivePoint.set(SIX, FIVE);
        this.objectivePoint.set(SEVEN, TWENTY);
    }
}
