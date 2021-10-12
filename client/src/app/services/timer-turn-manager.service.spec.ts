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
    it('turn should be one or zero', () => {
        service.initiateGame();
        const boolValue = service.turn === 1 || service.turn === 0;
        expect(boolValue).toBe(true);
    });
    it('floor should be called', () => {
        const floorSpy = spyOn(Math, 'floor');
        service.initiateGame();
        expect(floorSpy).toHaveBeenCalled();
    });
    it('end turn should change turn to 0', () => {
        service.turn = 1;
        service.endTurn('place');
        expect(service.turn).toEqual(0);
    });
    it('end turn should change turn to 1', () => {
        service.turn = 0;
        service.endTurn('place');
        expect(service.turn).toEqual(1);
    });
});
