import { TestBed } from '@angular/core/testing';
import { TileMap } from '@app/classes/grid-special-tile';

import { TileScramblerService } from './tile-scrambler.service';

describe('TileScramblerService', () => {
    let service: TileScramblerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(TileScramblerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('scambleTiles should call getBonusTiles reassignNewPosition setNewMapValues', () => {
        const spyBonus = spyOn(service, 'getBonusTiles');
        const spyNewPosition = spyOn(service, 'reassignNewPosition');
        const spyNewMap = spyOn(service, 'setNewMapValues');
        service.scrambleTiles();
        expect(spyBonus).toHaveBeenCalled();
        expect(spyNewPosition).toHaveBeenCalled();
        expect(spyNewMap).toHaveBeenCalled();
    });

    it('getBonusTiles should call forEach once', () => {
        // const spyforEach = spyOn(TileMap.gridMap.tileMap, 'forEach');
        const expectedRes = 61;
        service.getBonusTiles();
        expect(service.allBonusTiles.length).toEqual(expectedRes);
    });

    it('reassignNewPosition should call push at least 4 times', () => {
        const spyPushDL = spyOn(service.newPositionDoubleLetter, 'push');
        const spyPushDW = spyOn(service.newPositionDoubleWord, 'push');
        const spyPushTL = spyOn(service.newPositionTripleLetter, 'push');
        const spyPushTW = spyOn(service.newPositionTripleWord, 'push');
        service.reassignNewPosition();
        expect(spyPushDL).toHaveBeenCalled();
        expect(spyPushDW).toHaveBeenCalled();
        expect(spyPushTL).toHaveBeenCalled();
        expect(spyPushTW).toHaveBeenCalled();
    });

    it('setNewMapValues should call set ', () => {
        const spySet = spyOn(TileMap.gridMap.tileMap, 'set');
        service.setNewMapValues();
        expect(spySet).toHaveBeenCalled();
    });
});
