import { Injectable } from '@angular/core';
import * as Constants from '@app/constants';
import { TimerTurnManagerService } from './timer-turn-manager.service';
import { TileMap } from '@app/classes/grid-special-tile';
import { Position } from '@app/position-tile-interface';
@Injectable({
    providedIn: 'root',
})
export class ObjectivesService {
    objectiveMap: Map<number, string>;
    objectivePoint: Map<number, number>;
    objectiveVerif: Map<number, () => boolean>;
    wordsCreated: string[];
    indexLastLetters: number[];
    lastLettersAdded = '';
    pointsLastWord: number;
    consectivePlacementPlayers = [0, 0];
    consNoBonus = [0, 0];
    constructor(private timeManager: TimerTurnManagerService) {
        this.objectiveMap = new Map<number, string>();
        this.objectivePoint = new Map<number, number>();
        this.objectiveVerif = new Map<number, () => boolean>();
        this.objectiveMap.set(0, 'Utliser au moins 6 lettres différentes dans un seul placement (provenant du jeu ou du chevalet)');
        this.objectiveMap.set(
            1,
            "Placer 3 mots de suite sans avoir un bonus d'une case bonus (échange ou passage de tour ne réinitialise pas le compte)",
        );
        this.objectiveMap.set(2, 'Former un mot en utilisant aucune consonne provenant du chevalet');
        this.objectiveMap.set(3, 'Former un mot 5 tour de suite sans échanger ou passer son tour');
        this.objectiveMap.set(Constants.FOUR, 'Faites un placement de 20 points ou plus avec moins de 3 lettres provenant du chevalet');
        this.objectiveMap.set(Constants.FIVE, 'Placer une lettre sur un des coins');
        this.objectiveMap.set(Constants.SIX, "Placer des lettres de bord en bord d'une lettre déjà en jeu pour former un mot");
        this.objectiveMap.set(Constants.SEVEN, 'Former un palindrome');
        this.objectivePoint.set(0, Constants.TWENTY);
        this.objectivePoint.set(1, Constants.FIFTEEN);
        this.objectivePoint.set(2, Constants.TWELVE);
        this.objectivePoint.set(3, Constants.TWELVE);
        this.objectivePoint.set(Constants.FOUR, Constants.TEN);
        this.objectivePoint.set(Constants.FIVE, Constants.TWENTY);
        this.objectivePoint.set(Constants.SIX, Constants.EIGHT);
        this.objectivePoint.set(Constants.SEVEN, Constants.THIRTY);
        this.objectiveVerif.set(0, this.diffLetters0);
        this.objectiveVerif.set(1, this.wordsNoBonus1);
        this.objectiveVerif.set(2, this.noConsonant2);
        this.objectiveVerif.set(3, this.consecutivePlace3);
        this.objectiveVerif.set(Constants.FOUR, this.highPointsLowLetter4);
        this.objectiveVerif.set(Constants.FIVE, this.corner5);
        this.objectiveVerif.set(Constants.SIX, this.sideToSide6);
        this.objectiveVerif.set(Constants.SEVEN, this.palindrom7);
    }

    diffLetters0(): boolean {
        let diffLetters = '';
        for (const word of this.wordsCreated) {
            for (const letter of word) {
                if (!diffLetters.includes(letter)) {
                    diffLetters += letter;
                    if (diffLetters.length === Constants.SIX) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    wordsNoBonus1(): boolean {
        const allBonuses: Position[] = [];
        TileMap.gridMap.tileMap.forEach((value) => {
            for (const position of value) {
                allBonuses.push(position);
            }
        });

        for (let i = 0; i < this.indexLastLetters.length; i += 2) {
            for (const position of allBonuses) {
                if (position.positionY - 1 === this.indexLastLetters[i] && position.positionX - 1 === this.indexLastLetters[i + 1]) {
                    this.consNoBonus[this.timeManager.turn] = 0;
                    return false;
                }
            }
        }
        if (this.consNoBonus[this.timeManager.turn]++ === 3) {
            return true;
        }
        return false;
    }

    noConsonant2(): boolean {
        const regexConsonnant = /[bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]/;
        if (regexConsonnant.exec(this.lastLettersAdded)) {
            return false;
        }
        return true;
    }

    consecutivePlace3(): boolean {
        if (this.consectivePlacementPlayers[this.timeManager.turn] === Constants.FOUR) {
            return true;
        }
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
