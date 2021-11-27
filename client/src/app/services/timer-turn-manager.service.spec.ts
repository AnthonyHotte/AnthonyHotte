import { TestBed } from '@angular/core/testing';

import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('TimerTurnManager', () => {
    let service: TimerTurnManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TimerTurnManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('end turn should change turn to 0', () => {
        service.turn = 1;
        service.endTurn('place');
        expect(service.turn).toEqual(0);
    });
    it('end turn should change turn to 1', () => {
        service.turn = 0;
        service.endTurn('skip');
        expect(service.turn).toEqual(1);
    });
});
