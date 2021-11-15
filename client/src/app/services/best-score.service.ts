import { Injectable } from '@angular/core';
import { BestScore } from '@app/classes/best-score';

@Injectable({
    providedIn: 'root',
})
export class BestScoreService {
    bestScore: BestScore[][];
    mode: number;
    constructor() {
        this.bestScore = [];
        this.bestScore.push([]);
        this.bestScore.push([]);
        this.bestScore[0].push({ name: 'tony', score: 99 });
        this.bestScore[0].push({ name: 'Hotte', score: 78 });
        this.bestScore[1].push({ name: 'tony', score: 108 });
        this.bestScore[1].push({ name: 'Hotte', score: 54 });
    }
    
}
