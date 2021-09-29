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
        const possibility = service.checkRight(letterOnBoard, 0, 1, { row: 1, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
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

    it('checkRight should return that left is available', () => {
        const letterOnBoard = [
            ['', ''],
            ['', ''],
        ];
        const possibility = service.checkLeft(letterOnBoard, 0, 1, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Left);
    });
    it('checkRight should return that left is available and right', () => {
        const letterOnBoard = [
            ['', ''],
            ['', ''],
        ];
        const possibility = service.checkLeft(letterOnBoard, 0, 1, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Right });
        expect(possibility.placement).toEqual(PlacementValidity.LeftRight);
    });
    it('checkRight should return that right is not available when at the limit of the board', () => {
        const letterOnBoard = [
            ['', ''],
            ['', ''],
        ];
        const possibility = service.checkLeft(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Nothing);
    });
    it('checkRight should return that right is not available when already a letter there', () => {
        const letterOnBoard = [
            ['y', ''],
            ['', ''],
        ];
        const possibility = service.checkLeft(letterOnBoard, 1, 0, { row: 1, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Nothing);
    });
    // mmmm
    it('checkDown should return that down is not available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['c', ''],
        ];
        const possibility = service.checkDown(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Nothing);
    });
    it('checkDown should return that down is not available when at the edge', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkDown(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Nothing);
    });
    it('checkDown should return that down is available', () => {
        const letterOnBoard = [
            ['', 'g'],
            ['', ''],
        ];
        const possibility = service.checkDown(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.HDown);
    });
    it('checkDown should return that down is available and left', () => {
        const letterOnBoard = [
            ['', 'g'],
            ['', ''],
        ];
        const possibility = service.checkDown(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Left });
        expect(possibility.placement).toEqual(PlacementValidity.HDownLeft);
    });
    it('checkDown should return that down is available and left and right', () => {
        const letterOnBoard = [
            ['', 'g'],
            ['', ''],
        ];
        const possibility = service.checkDown(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.LeftRight });
        expect(possibility.placement).toEqual(PlacementValidity.HDownLeftRight);
    });
    it('checkDown should return that down is available and right', () => {
        const letterOnBoard = [
            ['', 'g'],
            ['', ''],
        ];
        const possibility = service.checkDown(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Right });
        expect(possibility.placement).toEqual(PlacementValidity.HDownRight);
    });

    // check up
    it('checkUp should return that up is not available', () => {
        const letterOnBoard = [
            ['c', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Nothing);
    });
    it('checkUp should return that up is not available when at edge', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 0, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.Nothing);
    });
    it('checkUp should return that up is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Nothing });
        expect(possibility.placement).toEqual(PlacementValidity.HUp);
    });
    it('checkUp should return that up, left is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Left });
        expect(possibility.placement).toEqual(PlacementValidity.HUpLeft);
    });
    it('checkUp should return that up, right is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.Right });
        expect(possibility.placement).toEqual(PlacementValidity.HUpRight);
    });
    it('checkUp should return that up, down is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.HDown });
        expect(possibility.placement).toEqual(PlacementValidity.HUpHDown);
    });
    it('checkUp should return that up, right, left is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.LeftRight });
        expect(possibility.placement).toEqual(PlacementValidity.HUpLeftRight);
    });
    it('checkUp should return that up, down, left is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.HDownLeft });
        expect(possibility.placement).toEqual(PlacementValidity.HUpHDownLeft);
    });
    it('checkUp should return that up, down, right is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.HDownRight });
        expect(possibility.placement).toEqual(PlacementValidity.HUpHDownRight);
    });
    it('checkUp should return that up, down, right, left is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const possibility = service.checkUp(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.HDownLeftRight });
        expect(possibility.placement).toEqual(PlacementValidity.HDownLeftRightHUp);
    });
    it('checkALL should return that up, down, right, left is available', () => {
        const letterOnBoard = [
            ['', 'o'],
            ['', ''],
        ];
        const expectedValue = { row: 0, column: 0, letter: 'a', placement: PlacementValidity.HDownLeftRightHUp };
        const spy = spyOn(service, 'checkUp').and.returnValue(expectedValue);
        const possibility = service.checkAll(letterOnBoard, 1, 0, { row: 0, column: 0, letter: 'a', placement: PlacementValidity.HDownLeftRight });
        expect(possibility.placement).toEqual(PlacementValidity.HDownLeftRightHUp);
        expect(spy).toHaveBeenCalled();
    });
});
