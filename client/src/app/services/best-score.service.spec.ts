import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';

import { BestScoreService } from './best-score.service';
import { CommunicationService } from './communication.service';

describe('BestScoreService', () => {
    let service: BestScoreService;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getBestScoreClassique', 'getBestScoreLog2990', 'sendScoreChanges']);
        communicationServiceSpy.getBestScoreClassique.and.returnValue(new Observable());
        communicationServiceSpy.getBestScoreLog2990.and.returnValue(new Observable());
        communicationServiceSpy.sendScoreChanges.and.returnValue(new Observable());
        await TestBed.configureTestingModule({
            providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
            imports: [HttpClientTestingModule],
        }).compileComponents();
    });
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(BestScoreService);
        service.bestScore = [
            [
                { score: 10, name: ['tony'] },
                { score: 8, name: ['tony'] },
                { score: 7, name: ['tony'] },
                { score: 5, name: ['tony'] },
                { score: 4, name: ['tony'] },
            ],
            [],
        ];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('updateBestScore should call getBestScoreClassique and getBestScoreLog2990', () => {
        communicationServiceSpy.getBestScoreClassique.and.returnValue(of([{ score: 20, name: ['tony'] }]));
        communicationServiceSpy.getBestScoreLog2990.and.returnValue(of([{ score: 20, name: ['tony'] }]));
        service.updateBestScore();
        expect(communicationServiceSpy.getBestScoreClassique).toHaveBeenCalled();
        expect(communicationServiceSpy.getBestScoreLog2990).toHaveBeenCalled();
    });
    it('verifyIfBestScore should verify if can be place in best score', () => {
        const score = 20;
        const isBest = service.verifyIfBestScore(score, 0);
        expect(isBest).toBe(true);
    });
    it('addBestScore should add score', () => {
        const score = 20;
        const spy = spyOn(service, 'sendScoreChangesToMongo');
        service.addBestScore('tony', score, 0);
        expect(service.bestScore[0][0].score).toEqual(score);
        expect(spy).toHaveBeenCalled();
    });
    it('addBestScore should add score when equal', () => {
        const score = 10;
        const spy = spyOn(service, 'sendScoreChangesToMongo');
        service.addBestScore('tony', score, 0);
        expect(service.bestScore[0][0].score).toEqual(score);
        expect(spy).toHaveBeenCalled();
    });
    it('clearBestScore should clear score', () => {
        const score = 120;
        const spy = spyOn(service, 'sendScoreChangesToMongo');
        service.clearBestScore();
        expect(service.bestScore[0][0].score).toEqual(score);
        expect(spy).toHaveBeenCalled();
    });
    it('sendScoreChangesToMongo should send score to mongo', () => {
        service.sendScoreChangesToMongo(0);
        expect(communicationServiceSpy.sendScoreChanges).toHaveBeenCalled();
    });
});
