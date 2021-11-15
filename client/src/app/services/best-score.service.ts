import { Injectable } from '@angular/core';
import { BestScore } from '@app/classes/best-score';
import { BASEDEFAULTBESTSCORE, MAXNUMBERBESTSCORE } from '@app/constants';

@Injectable({
    providedIn: 'root',
})
export class BestScoreService {
    bestScore: BestScore[][];
    constructor() {
        this.bestScore = [];
        this.bestScore.push([]);
        this.bestScore.push([]);
        for (let i = 0; i < MAXNUMBERBESTSCORE; i++) {
            this.bestScore[0].push({ name: ['Player' + i], score: BASEDEFAULTBESTSCORE + 2 * i });
            this.bestScore[1].push({ name: ['Player' + i], score: BASEDEFAULTBESTSCORE + 3 * i });
        }
    }
    verifyIfBestScore(score: number, mode: number) {
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
                this.sendScoreChangesToMongo(mode);
                return true;
            } else if (score >= this.bestScore[mode][index].score) {
                const tempBestScore = this.bestScore[mode][index].score;
                const tempBestName = this.bestScore[mode][index].name;
                this.bestScore[mode][index].score = score;
                this.bestScore[mode][index].name = [name];
                for (const oneName of tempBestName) {
                    this.addBestScore(oneName, tempBestScore, mode);
                }
                this.sendScoreChangesToMongo(mode);
                return true;
            }
            index++;
        }
        return false;
    }
    clearBestScore() {
        this.bestScore[0] = [];
        this.bestScore[1] = [];
        for (let i = 0; i < MAXNUMBERBESTSCORE; i++) {
            this.bestScore[0].push({ name: ['Player' + i], score: BASEDEFAULTBESTSCORE + 2 * i });
            this.bestScore[1].push({ name: ['Player' + i], score: BASEDEFAULTBESTSCORE + 3 * i });
        }
        this.sendScoreChangesToMongo(0);
        this.sendScoreChangesToMongo(1);
    }
    // eslint-disable-next-line no-unused-vars
    sendScoreChangesToMongo(mode: number) {
        // TODO
        // send to mongo
    }
}
