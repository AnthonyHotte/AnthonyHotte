import { TestBed, waitForAsync } from '@angular/core/testing';

import { ObjectivesService } from './objectives.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
import { TileMap } from '@app/classes/grid-special-tile';
import * as Constants from '@app/constants';

fdescribe('ObjectivesService', () => {
    let service: ObjectivesService;
    let timeManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let tileMapSpy: jasmine.SpyObj<TileMap>;
    beforeEach(
        waitForAsync(() => {
            timeManagerSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
            tileMapSpy = jasmine.createSpyObj('TileMap', ['isDoubleWordTile']);

            TestBed.configureTestingModule({
                providers: [
                    { provide: TimerTurnManagerService, useValue: timeManagerSpy },
                    { provide: TileMap, useValue: tileMapSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        service = TestBed.inject(ObjectivesService);
        service.consectivePlacementPlayers = [1, Constants.FOUR];
        service.consNoBonus = [1, 3];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('diffLetters0 should return true if words created use 6 different letters', () => {
        service.wordsCreated = ['qqertyui'];
        expect(service.diffLetters0()).toBeTrue();
    });

    it('diffLetters0 should return false if words created use less than 6 different letters', () => {
        service.wordsCreated = ['qwer'];
        expect(service.diffLetters0()).toBeFalse();
    });

    it('wordsNoBonus1 should return true if there has been 3 turn without bonus', () => {
        timeManagerSpy.turn = 1;
        service.indexLastLetters = [1, 0, 2, 0];
        expect(service.wordsNoBonus1()).toBeTrue();
    });

    it('wordsNoBonus1 should return false if there has not been 3 turn without bonus', () => {
        timeManagerSpy.turn = 0;
        service.indexLastLetters = [1, 0, 2, 0];
        expect(service.wordsNoBonus1()).toBeFalse();
    });

    it('wordsNoBonus1 should return false if there word is on bonus', () => {
        timeManagerSpy.turn = 0;
        service.indexLastLetters = [1, 0, 1, 1];
        expect(service.wordsNoBonus1()).toBeFalse();
    });

    it('noConsonant2 should return true if last letters added do not contain a consonnant', () => {
        service.lastLettersAdded = 'ao';
        expect(service.noConsonant2()).toBeTrue();
    });

    it('noConsonant2 should return false if last letters added contain a consonnant', () => {
        service.lastLettersAdded = 'allo';
        expect(service.noConsonant2()).toBeFalse();
    });

    it('consecutivePlace3 should return true if the player has a consecutive placement of 4', () => {
        timeManagerSpy.turn = 1;
        expect(service.consecutivePlace3()).toBeTrue();
    });

    it('consecutivePlace3 should return true if the player has a consecutive placement of 4', () => {
        timeManagerSpy.turn = 0;
        expect(service.consecutivePlace3()).toBeFalse();
    });

    it('highPointsLowLetter4 should return true if the player made 20 points using 2 letters', () => {
        service.indexLastLetters = [1, 0, 1, 1];
        service.pointsLastWord = 20;
        expect(service.highPointsLowLetter4()).toBeTrue();
    });

    it('highPointsLowLetter4 should return false if the player made 10 points using 4 letters', () => {
        service.indexLastLetters = [1, 0, 1, 1, 1, 2, 1, 3];
        service.pointsLastWord = 10;
        expect(service.highPointsLowLetter4()).toBeFalse();
    });

    it('corner5 should return true if letter added on corner', () => {
        service.indexLastLetters = [0, 0, 0, 1];
        expect(service.corner5()).toBeTrue();
    });

    it('corner5 should return true if letter added on corner', () => {
        service.indexLastLetters = [2, 3, Constants.FOURTEEN, Constants.FOURTEEN];
        expect(service.corner5()).toBeTrue();
    });

    it('corner5 should return true if letter added on corner', () => {
        service.indexLastLetters = [2, 3, 0, Constants.FOURTEEN];
        expect(service.corner5()).toBeTrue();
    });

    it('corner5 should return false if letter not added on corner', () => {
        service.indexLastLetters = [1, 0, 1, 1, 1, 2, 1, 3];
        expect(service.corner5()).toBeFalse();
    });

    it('sideToSide6 should return false if only one letter was added', () => {
        service.indexLastLetters = [1, 0];
        expect(service.sideToSide6()).toBeFalse();
    });

    it('sideToSide6 should return true if horizontal word last letters added presents gap', () => {
        service.indexLastLetters = [1, 0, 1, 1, 1, 3];
        expect(service.sideToSide6()).toBeTrue();
    });
    it('sideToSide6 should return true if vertical word last letters added presents gap', () => {
        service.indexLastLetters = [0, 1, 1, 1, 3, 1];
        expect(service.sideToSide6()).toBeTrue();
    });

    it('sideToSide6 should return false last letters added presents gap', () => {
        service.indexLastLetters = [0, 1, 1, 1];
        expect(service.sideToSide6()).toBeFalse();
    });

    it('palindrom7 should return true when a palindrom is created', () => {
        service.wordsCreated = ['allo', 'lol'];
        expect(service.palindrom7()).toBeTrue();
    });

    it('palindrom7 should return false when no palindrom is created', () => {
        service.wordsCreated = ['allo', 'ok'];
        expect(service.palindrom7()).toBeFalse();
    });
});
