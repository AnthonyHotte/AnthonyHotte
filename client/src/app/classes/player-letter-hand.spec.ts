import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';

describe('CanvasTestHelper', () => {
    let canvasTestHelper: CanvasTestHelper;

    beforeEach(() => {
        canvasTestHelper = TestBed.inject(CanvasTestHelper);
    });

    it('should be created', () => {
        expect(canvasTestHelper).toBeTruthy();
    });
});
