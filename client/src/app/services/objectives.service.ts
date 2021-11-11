import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    static objectives = new ObjectivesService();
    objectiveMap: Map<number, string>;
    objectivePoint: Map<number, number>;
    wordsCreated: string[];
    indexLastLetters: number[];
    pointsLastWord: number;
    constructor() {
        this.objectiveMap = new Map<number, string>();
        this.objectivePoint = new Map<number, number>();
        this.objectiveMap = new Map<number, string>();
        this.objectiveMap.set(0, 'Utliser au moins 6 lettres différentes dans un seul placement (sur le jeu ou en main)');
        this.objectiveMap.set(1, "Placer 3 mots de suite sans avoir un bonus d'une case bonus");
        this.objectiveMap.set(2, 'Créer un mot en utilisant aucune consonne provenant de la main');
        this.objectiveMap.set(3, 'Placer un mot 5 tour de suite sans échanger ou passer son tour');
        this.objectiveMap.set(Constants.FOUR, 'Faites un placement de 20 points ou plus avec moins de 3 lettres provenant de la main');
        this.objectiveMap.set(Constants.FIVE, 'Placer une lettre sur un des coins');
        this.objectiveMap.set(Constants.SIX, "Placer des lettres de bord en bord d'une lettre déjà en jeu pour former un mot");
        this.objectiveMap.set(Constants.SEVEN, 'Placer un palindrome');
        this.objectivePoint.set(0, Constants.FIFTEEN);
        this.objectivePoint.set(1, Constants.TWELVE);
        this.objectivePoint.set(2, Constants.TEN);
        this.objectivePoint.set(3, Constants.TEN);
        this.objectivePoint.set(Constants.FOUR, Constants.EIGHT);
        this.objectivePoint.set(Constants.FIVE, Constants.FIFTEEN);
        this.objectivePoint.set(Constants.SIX, Constants.FIVE);
        this.objectivePoint.set(Constants.SEVEN, Constants.TWENTY);
    }
    objVerif(obj: number): boolean {
        switch (obj) {
            case 0: {
                return this.diffLetters0();
            }
            case 1: {
                return this.wordsNoBonus1();
            }
            case 2: {
                return this.noConsonant2();
            }
            case 3: {
                return this.consecutivePlace3();
            }
            case Constants.FOUR: {
                return this.highPointsLowLetter4();
            }
            case Constants.FIVE: {
                return this.corner5();
            }
            case Constants.SIX: {
                return this.sideToSide6();
            }
            case Constants.SEVEN: {
                return this.palindrom7();
            }
            default: {
                return false;
            }
        }
    }
    diffLetters0(): boolean {
        return false;
    }

    wordsNoBonus1(): boolean {
        return false;
    }

    noConsonant2(): boolean {
        return false;
    }

    consecutivePlace3(): boolean {
        return false;
    }

    highPointsLowLetter4(): boolean {
        if (this.indexLastLetters.length < Constants.SIX && this.pointsLastWord >= Constants.TWENTY) {
            return true;
        }
        return false;
    }

    corner5(): boolean {
        for (let i = 0; i < this.indexLastLetters.length; i += 2) {
            if (
                (this.indexLastLetters[i] === 0 && this.indexLastLetters[i + 1] === 0) ||
                (this.indexLastLetters[i] === 0 && this.indexLastLetters[i + 1] === Constants.FOURTEEN) ||
                (this.indexLastLetters[i] === Constants.FOURTEEN && this.indexLastLetters[i + 1] === 0) ||
                (this.indexLastLetters[i] === Constants.FOURTEEN && this.indexLastLetters[i + 1] === Constants.FOURTEEN)
            ) {
                return true;
            }
        }
        return false;
    }

    sideToSide6(): boolean {
        if (this.indexLastLetters.length <= 2) {
            return false;
        }
        if (this.indexLastLetters[0] === this.indexLastLetters[2]) {
            for (let i = 0; i < this.indexLastLetters.length - 2; i += 2) {
                if (this.indexLastLetters[i + 1] + 1 !== this.indexLastLetters[i + 3]) {
                    return true;
                }
            }
        } else {
            for (let i = 0; i < this.indexLastLetters.length - 2; i += 2) {
                if (this.indexLastLetters[i] + 1 !== this.indexLastLetters[i + 2]) {
                    return true;
                }
            }
        }
        return false;
    }

    palindrom7(): boolean {
        for (const word of this.wordsCreated) {
            let beginIndex = 0;
            let endIndex = word.length - 1;
            let isPalindrom = true;
            while (beginIndex < endIndex) {
                if (word.charAt(beginIndex++) !== word.charAt(endIndex--)) {
                    isPalindrom = false;
                }
            }
            if (isPalindrom) {
                return true;
            }
        }
        return false;
    }
}
