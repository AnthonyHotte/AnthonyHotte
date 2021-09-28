import { TestBed } from '@angular/core/testing';
import { PossibilityChecker } from '@app/classes/possibility-checker';

describe('CanvasTestHelper', () => {
    let service: PossibilityChecker;

    beforeEach(() => {
        service = TestBed.inject(PossibilityChecker);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    /*
    it('checkRight should be created', () => {
        const letterOnBoard = [['','']]
        expect(service).toBeTruthy();
    });
    */
});
