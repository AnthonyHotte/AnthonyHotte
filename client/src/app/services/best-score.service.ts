import { Injectable } from '@angular/core';
import { BestScore } from '@app/classes/best-score';
import { MAXNUMBERBESTSCORE } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class BestScoreService {
    bestScore: BestScore[][];
    constructor() {
        this.bestScore = [];
        this.bestScore.push([]);
        this.bestScore.push([]);
        this.bestScore[0].push({ name: ['tony'], score: 99 });
        this.bestScore[0].push({ name: ['Hotte'], score: 78 });
        this.bestScore[1].push({ name: ['tony'], score: 108 });
        this.bestScore[1].push({ name: ['Hotte'], score: 54 });
    }
    verifyIfBestScore(score: number, mode: number) {
        if (this.bestScore[mode].length < MAXNUMBERBESTSCORE) {
            return true;
        }
        for (let i = 0; i < MAXNUMBERBESTSCORE; i++) {
            if (score >= this.bestScore[mode][i].score) {
                return true;
            }
        }
        return false;
    }
    addBestScore(name: string, score: number, mode: number) {
        let index = 0;
        for (const best of this.bestScore[mode]) {
            if (score === best.score) {
                this.bestScore[mode][index].name.push(name);
                return true;
            } else if (score >= this.bestScore[mode][index].score) {
                const tempBestScore = this.bestScore[mode][index].score;
                const tempBestName = this.bestScore[mode][index].name;
                this.bestScore[mode][index].score = score;
                this.bestScore[mode][index].name = [name];
                for (const oneName of tempBestName) {
                    this.addBestScore(oneName, tempBestScore, mode);
                }
                return true;
            }
            index++;
        }
        return false;
    }
    clearBestScore() {
        this.bestScore[0] = [];
        this.bestScore[1] = [];
        // TODO
        // send changes to Mongo
    }
}
