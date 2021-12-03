import { TestBed } from '@angular/core/testing';
import { CanvasTestHelper } from '@app/classes/canvas-test-helper';
import { TileMap } from '@app/classes/grid-special-tile';
import { DEFAULT_WIDTH } from '@app/constants';
import { GridService } from '@app/services/grid.service';

describe('GridService', () => {
    let service: GridService;
    let ctxStub: CanvasRenderingContext2D;

    const CANVAS_WIDTH = DEFAULT_WIDTH;
    const CANVAS_HEIGHT = DEFAULT_WIDTH;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GridService);
        TileMap.gridMap = new TileMap();
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
    it(' drawStar should call stroke, moveTo, lineTo, fill 1, 1, 11, 1  times', () => {
        const expectedCallLineToTimes = 11;
        const expectedCallMoveToTimes = 1;
        const expectedCallStrokeTimes = 1;
        const expectedCallFillTimes = 1;
        const strokeSpy = spyOn(service.gridContext, 'stroke').and.callThrough();
        const moveToSpy = spyOn(service.gridContext, 'moveTo').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'lineTo').and.callThrough();
        const fillSpy = spyOn(service.gridContext, 'fill').and.callThrough();
        service.drawStar();
        expect(strokeSpy).toHaveBeenCalledTimes(expectedCallStrokeTimes);
        expect(moveToSpy).toHaveBeenCalledTimes(expectedCallMoveToTimes);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallLineToTimes);
        expect(fillSpy).toHaveBeenCalledTimes(expectedCallFillTimes);
    });
    it(' drawLetterwithpositionstring should call strokeRect, drawLetterValuewithposition, fillRect, fillText 1, 3, 2, 3  times', () => {
        const strokeSpy = spyOn(service.gridContext, 'strokeRect').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        const spy = spyOn(service, 'drawLetterValuewithposition');
        service.drawLetterwithpositionstring('a', 0, 0, 'black');
        expect(strokeSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it(' drawLetterwithpositionstring red should call strokeRect, drawLetterValuewithposition, fillRect, fillText 1, 3, 2, 3  times', () => {
        const strokeSpy = spyOn(service.gridContext, 'strokeRect').and.callThrough();
        const lineToSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const fillSpy = spyOn(service.gridContext, 'fillRect').and.callThrough();
        const spy = spyOn(service, 'drawLetterValuewithposition');
        service.drawLetterwithpositionstring('a', 0, 0, 'red');
        expect(strokeSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(fillSpy).toHaveBeenCalled();
        expect(spy).toHaveBeenCalled();
    });

    it(' drawLetterValuewithposition should call filltext 1 times', () => {
        const expectedCallFillTextTimes = 1;
        const lineToSpy = spyOn(service.gridContext, 'fillText').and.callThrough();
        const letter = { letter: 'a', quantity: 1, point: 1 };
        service.drawLetterValuewithposition(letter, 0, 0);
        expect(lineToSpy).toHaveBeenCalledTimes(expectedCallFillTextTimes);
    });
    it(' increasePoliceSize should increment size of a letter', () => {
        service.policesizeletter = 25;
        service.policesizelettervalue = 12;
        const expectedPoliceSizeLetter = 27;
        const expectedPoliceSizeLetterValue = 13;
        service.increasePoliceSize();
        expect(service.policesizeletter).toEqual(expectedPoliceSizeLetter);
        expect(service.policesizelettervalue).toEqual(expectedPoliceSizeLetterValue);
    });

    it(' decreasePoliceSize should decresse size of letteroffset', () => {
        service.policesizeletter = 29;
        service.maxpolicesizeletter = 50;
        service.letteroffset = 2;
        service.decreasePoliceSize();
        expect(service.letteroffset).toEqual(2);
    });

    it(' increasePoliceSize should increment size of letteroffset', () => {
        service.policesizeletter = 29;
        service.maxpolicesizeletter = 50;
        service.letteroffset = 2;
        service.increasePoliceSize();
        expect(service.letteroffset).toEqual(2);
    });
    it(' increasePoliceSize should not increment size of a letter', () => {
        service.policesizeletter = 55;
        service.policesizelettervalue = 52;
        const expectedPoliceSizeLetter = 57;
        const expectedPoliceSizeLetterValue = 52;
        service.increasePoliceSize();
        expect(service.policesizeletter).toEqual(expectedPoliceSizeLetter);
        expect(service.policesizelettervalue).toEqual(expectedPoliceSizeLetterValue);
    });
    it(' decreasePoliceSize should decrement size of a letter', () => {
        service.policesizeletter = 25;
        service.policesizelettervalue = 15;
        const expectedPoliceSizeLetter = 25;
        const expectedPoliceSizeLetterValue = 15;
        service.decreasePoliceSize();
        expect(service.policesizeletter).toEqual(expectedPoliceSizeLetter);
        expect(service.policesizelettervalue).toEqual(expectedPoliceSizeLetterValue);
    });
    it(' decreasePoliceSize should not decrement size of a letter', () => {
        service.policesizeletter = 20;
        service.policesizelettervalue = 10;
        const expectedPoliceSizeLetter = 20;
        const expectedPoliceSizeLetterValue = 10;
        service.decreasePoliceSize();
        expect(service.policesizeletter).toEqual(expectedPoliceSizeLetter);
        expect(service.policesizelettervalue).toEqual(expectedPoliceSizeLetterValue);
    });

    it(' drawArrow should call beginPath canvasArrow and stroke when orientation h', () => {
        const strokeSpy = spyOn(service.gridContext, 'stroke');
        const lineToSpy = spyOn(service, 'canvasArrow');
        const beginPathSpy = spyOn(service.gridContext, 'beginPath');
        service.drawarrow('h', 1, 1);
        expect(strokeSpy).toHaveBeenCalled();
        expect(lineToSpy).toHaveBeenCalled();
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it(' drawArrow should call beginPath canvasArrow and stroke when orientation v', () => {
        const strokeSpy = spyOn(service.gridContext, 'stroke');
        const canvasArrowToSpy = spyOn(service, 'canvasArrow');
        const beginPathSpy = spyOn(service.gridContext, 'beginPath');
        service.drawarrow('v', 1, 1);
        expect(strokeSpy).toHaveBeenCalled();
        expect(canvasArrowToSpy).toHaveBeenCalled();
        expect(beginPathSpy).toHaveBeenCalled();
    });

    it(' canvasArrow should call lineTo and moveTo', () => {
        const moveToSpy = spyOn(service.gridContext, 'moveTo');
        const lineToSpy = spyOn(service.gridContext, 'lineTo');
        service.canvasArrow(1, 1, 1, 1);
        expect(lineToSpy).toHaveBeenCalled();
        expect(moveToSpy).toHaveBeenCalled();
    });
});
