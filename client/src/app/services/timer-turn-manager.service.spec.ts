import { TestBed } from '@angular/core/testing';

import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('GestionTimerTourService', () => {
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
    it('turn should be one or zero', () => {
        const floorSpy = spyOn(Math, 'floor');
        service.initiateGame();
        expect(floorSpy).toHaveBeenCalled();
    });
    it('send turn should call next', () => {
        const nextSpy = spyOn(service.messageSource, 'next');
        service.turn = 0;
        const argNext = '0';
        service.sendTurn();
        expect(nextSpy).toHaveBeenCalledWith(argNext);
    });
    it('end turn should call sendTurn', () => {
        const sendTurnSpy = spyOn(service, 'sendTurn');
        service.endTurn();
        expect(sendTurnSpy).toHaveBeenCalled();
    });
    it('end turn should change turn to 0', () => {
        service.turn = 1;
        service.endTurn();
        expect(service.turn).toEqual(0);
    });
    it('end turn should change turn to 1', () => {
        service.turn = 0;
        service.endTurn();
        expect(service.turn).toEqual(1);
    });
});
