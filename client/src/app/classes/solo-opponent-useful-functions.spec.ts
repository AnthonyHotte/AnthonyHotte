import { SoloOpponentUsefulFunctions } from '@app/classes/solo-opponent-useful-functions';
import { PlacementValidity } from './placement-validity';

describe('SoloOpponentUsefulFunctions', () => {
    let service: SoloOpponentUsefulFunctions;

    beforeEach(() => {
        service = new SoloOpponentUsefulFunctions(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('rowToChar should return the right char', () => {
        expect(service.toChar(1)).toMatch('b');
    });
    it('rowToChar should return empty when not the right index', () => {
        const wrongIndex = 18;
        expect(service.toChar(wrongIndex)).toMatch('');
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