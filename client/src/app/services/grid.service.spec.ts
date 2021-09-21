import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = 500;
    const CANVAS_HEIGHT = 500;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        ctxStub = CanvasTestHelper.createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT).getContext('2d') as CanvasRenderingContext2D;
        service.gridContext = ctxStub;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it(' width should return the width of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_WIDTH);
    });

    it(' height should return the height of the grid canvas', () => {
        expect(service.width).toEqual(CANVAS_HEIGHT);
    });

    it(' drawWord should call fillText on the canvas', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawWord('test');
        expect(fillTextSpy).toHaveBeenCalled();
    });

    it(' drawWord should not call fillText if word is empty', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.drawWord('');
        expect(fillTextSpy).toHaveBeenCalledTimes(0);
    });

    it(' drawWord should call fillText as many times as letters in a word', () => {
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const word = 'test';
        service.drawWord(word);
        expect(fillTextSpy).toHaveBeenCalledTimes(word.length);
    });

    it(' drawWord should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawWord('test');
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });

    it(' drawGrid should call moveTo 31 times and lineTo 41 times', () => {
        const expectedCallMoveToTimes = 31;
        const expectedCallLineToTimes = 41;
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        service.drawGrid();
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallMoveToTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallLineToTimes);
    });

    it(' placeNumberTop should call stroke, moveTo, lineTo, fillText 15 times', () => {
        const expectedCallTimes = 15;
        const strokeSpy = spyOn(service.gridContext, 'stroke').and.callThrough();
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.placeNumberTop();
        expect(strokeSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(fillTextSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });
    it(' placeLetterSide should call stroke, moveTo, lineTo, fillText 15 times', () => {
        const expectedCallTimes = 15;
        const strokeSpy = spyOn(service.gridContext, 'stroke').and.callThrough();
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.placeLetterSide();
        expect(strokeSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(fillTextSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });

    it(' drawGrid should color pixels on the canvas', () => {
        let imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const beforeSize = imageData.filter((x) => x !== 0).length;
        service.drawGrid();
        imageData = service.gridContext.getImageData(0, 0, service.width, service.height).data;
        const afterSize = imageData.filter((x) => x !== 0).length;
        expect(afterSize).toBeGreaterThan(beforeSize);
    });
    it(' drawStar should call stroke, moveTo, lineTo, fillText 15 times', () => {
        const expectedCallLineToTimes = 11;
        const expectedCallMoveToTimes = 1;
        // const strokeSpy = spyOn(service.gridContext, 'stroke').and.callThrough();
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        // const fillTextSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        service.placeNumberTop();
        // expect(strokeSpy).toHaveBeenCalledTimes(expectedCallTimes);
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallMoveToTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallLineToTimes);
        // expect(fillTextSpy).toHaveBeenCalledTimes(expectedCallTimes);
    });
});
