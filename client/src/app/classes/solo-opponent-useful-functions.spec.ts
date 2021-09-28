import { TestBed } from '@angular/core/testing';
import { SoloOpponentUsefulFunctions } from '@app/classes/solo-opponent-useful-functions';
import { PlacementValidity } from './placement-validity';

describe('CanvasTestHelper', () => {
    let service: SoloOpponentUsefulFunctions;

    beforeEach(() => {
        service = TestBed.inject(SoloOpponentUsefulFunctions);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('rowToChar should return the right char', () => {
        expect(service.toChar(1)).toMatch('b');
    });
    it('enumToString should return the right direction when passed Left', () => {
        expect(service.enumToString(PlacementValidity.Left)).toMatch('h');
    });
    it('enumToString should return the right direction when passed Right', () => {
        expect(service.enumToString(PlacementValidity.Right)).toMatch('h');
    });
    it('enumToString should return the right direction when passed up', () => {
        expect(service.enumToString(PlacementValidity.HUp)).toMatch('v');
    });
    it('checkRowsAndColumnsForWordMatch should return the right direction when passed up', () => {
        expect(service.enumToString(PlacementValidity.HUp)).toMatch('v');
    });
});
