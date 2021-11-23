import { Component } from '@angular/core';
import { BestScore } from '@app/classes/best-score';
import { BestScoreService } from '@app/services/best-score.service';

@Component({
    selector: 'app-best-score-page',
    templateUrl: './best-score-page.component.html',
    styleUrls: ['./best-score-page.component.scss'],
})
export class BestScorePageComponent {
    bestScore: BestScore[][];
    constructor(private bestScoreService: BestScoreService) {
        this.bestScoreService.updateBestScore();
        this.getBestScore();
    }
    getBestScore() {
        this.bestScore = this.bestScoreService.bestScore;
    }
}
