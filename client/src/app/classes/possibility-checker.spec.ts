import { PossibilityChecker } from '@app/classes/possibility-checker';
import { PlacementValidity } from '@app/classes/placement-validity';

describe('PossibilityChecker', () => {
    let service: PossibilityChecker;

    beforeEach(() => {
        service = new PossibilityChecker(true);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('checkRight should return that right is available', () => {
        const letterOnBoard = [
            ['', ''],
            ['', ''],
        ];
        const possibility = service.checkRight(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Right);
    });
    it('checkRight should return that right is not available when at the limit of the board', () => {
        const letterOnBoard = [
            ['', ''],
            ['', ''],
        ];
        const possibility = service.checkRight(letterOnBoard, 1, 0, { row: 1, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Nothing);
    });
    it('checkRight should return that right is not available when already a letter there', () => {
        const letterOnBoard = [
            ['', 'y'],
            ['', ''],
        ];
        const possibility = service.checkRight(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Nothing);
    });
});
