import { TestBed } from '@angular/core/testing';
// import { PlayerLetterHand } from '@app/classes/player-letter-hand';
// import { Injectable } from '@angular/core';
// import * as Constants from '@app/constants';
// import { LetterService } from '@app/services/letter.service';
import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterClickService } from './place-letter-click.service';

// import { ScoreCalculatorService } from '@app/services/score-calculator.service';
// import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
// import { WordValidationService } from '@app/services/word-validation.service';

describe('PlaceLetterClickService', () => {
    let placeLetterclickservice: PlaceLetterClickService;
    // let placeLettersService: PlaceLettersService;
    // let playerLetterHandServiceSpy: PlayerLetterHand;
    let gameStateServiceSpy: GameStateService;
    let gridServiceSpy: GridService;
    let letterServiceSpy: LetterService;
    // let letterBankServiceSpy: LetterBankService;
    // let timeManagerSpy: TimerTurnManagerService;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        placeLetterclickservice = TestBed.inject(PlaceLetterClickService);
        // placeLettersService = TestBed.inject(PlaceLettersService);
        gameStateServiceSpy = TestBed.inject(GameStateService);
        gridServiceSpy = TestBed.inject(GridService);
        letterServiceSpy = TestBed.inject(LetterService);
        //  playerLetterHandServiceSpy = TestBed.inject(PlayerLetterHand);
        // letterBankServiceSpy = TestBed.inject();
        // timeManagerSpy = TestBed.inject();
    });

    it('should be created', () => {
        expect(placeLetterclickservice).toBeTruthy();
        expect(gameStateServiceSpy).toBeTruthy();
        expect(gridServiceSpy).toBeTruthy();
        expect(letterServiceSpy).toBeTruthy();
    });
    it('should remove letter with backspace', () => {
        placeLetterclickservice.wordPlacedWithClick = 'test';
        placeLetterclickservice.isTileSelected = true;
        const mySpy = spyOn(placeLetterclickservice, 'removeLetterWithBackspace');
        placeLetterclickservice.placeLetter('Backspace');
        expect(mySpy).toHaveBeenCalled();
    });
    it('should test if hand contains letter', () => {
        placeLetterclickservice.wordPlacedWithClick = 'test';
        placeLetterclickservice.isTileSelected = true;
        // const mySpy = spyOn(placeLetterclickservice, 'removeLetterWithBackspace');
        const mySpy2 = spyOn(letterServiceSpy.players[0], 'handContainLetters').and.returnValue(true);
        placeLetterclickservice.placeLetter('a');
        expect(mySpy2).toHaveBeenCalled();
    });
});
