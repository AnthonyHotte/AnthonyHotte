import { TestBed } from '@angular/core/testing';

import { SoloOpponentService } from './solo-opponent.service';
// import { GameStateService } from './game-state.service';
// import { LetterService } from './letter.service';
// import { PlaceLettersService } from './place-letters.service';
// import { SoloPlayerService } from './solo-player.service';
// import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('SoloOpponentService', () => {
    let service: SoloOpponentService;

    // let letterServiceSpy: LetterService;
    // let timerTurnManagerServiceSpy: TimerTurnManagerService;
    // let soloPlayerServiceSpy: SoloPlayerService;
    // let gameStateServiceSpy: GameStateService;
    // let placeLettersServiceSpy: PlaceLettersService;
    // let WordValidationServiceSpy: WordValidationService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(SoloOpponentService);
        // letterServiceSpy = jasmine.createSpyObj('LetterService', ['']);
        // timerTurnManagerServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['']);
        // soloPlayerServiceSpy = jasmine.createSpyObj('SoloPlayerService', ['']);
        // gameStateServiceSpy = jasmine.createSpyObj('TimerTurnManagerService', ['']);
        // placeLettersServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['']);
        // WordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', ['']);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
