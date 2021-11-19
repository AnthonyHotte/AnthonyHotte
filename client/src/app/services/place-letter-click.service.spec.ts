import { HttpClient } from '@angular/common/http';
import { TestBed, waitForAsync } from '@angular/core/testing';

import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterClickService } from './place-letter-click.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';

describe('PlaceLetterClickService', () => {
    let placeLetterClickService: PlaceLetterClickService;
    let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let timeManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let httpClientSpy: jasmine.SpyObj<HttpClient>;
    beforeEach(
        waitForAsync(() => {
            httpClientSpy = jasmine.createSpyObj('HttpClient', ['Get']);
            gameStateServiceSpy = jasmine.createSpyObj('GameStateService', ['placeLetter']);
            gridServiceSpy = jasmine.createSpyObj('GridService', ['drawGrid']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
            timeManagerSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
            letterServiceSpy.players[0].allLettersInHand = [
                { letter: 'a', quantity: 9, point: 1 },
                { letter: '*', quantity: 2, point: 0 },
            ];
            TestBed.configureTestingModule({
                declarations: [PlaceLetterClickService],
                providers: [
                    { provide: GameStateService, useValue: gameStateServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: TimerTurnManagerService, useValue: timeManagerSpy },
                    { provide: GridService, useValue: gridServiceSpy },
                    { provide: HttpClient, useValue: httpClientSpy },
                ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        placeLetterClickService = TestBed.inject(PlaceLetterClickService);
        placeLetterClickService.row = 2;
        placeLetterClickService.colomnNumber = 2;
    });

    it('should be created', () => {
        expect(placeLetterClickService).toBeTruthy();
        expect(gameStateServiceSpy).toBeTruthy();
        expect(gridServiceSpy).toBeTruthy();
        expect(letterServiceSpy).toBeTruthy();
        expect(timeManagerSpy).toBeTruthy();
    });
    it('placeLetter should not change anything when tile is not selected', () => {
        placeLetterClickService.isTileSelected = false;
        placeLetterClickService.placeLetter('A');
        expect(placeLetterClickService.isTileSelected).toBeFalse();
    });

    it('placeLetter should call removeLetterWithBackspace letter when Backspace', () => {
        placeLetterClickService.isTileSelected = true;
        placeLetterClickService.wordPlacedWithClick = 'test';
        const mySpy = spyOn(placeLetterClickService, 'removeLetterWithBackspace');
        placeLetterClickService.placeLetter('Backspace');
        expect(mySpy).toHaveBeenCalled();
    });

    it('placeLetter should not call handContainLetters when input is longer than 1', () => {
        placeLetterClickService.isTileSelected = true;
        const mySpy = spyOn(letterServiceSpy.players[0], 'handContainLetters');
        placeLetterClickService.placeLetter('hello');
        expect(mySpy).not.toHaveBeenCalled();
    });

    it('placeLetter should add Letter on Board if letter is minuscule and player hand contains it', () => {
        placeLetterClickService.isTileSelected = true;
        const mySpy = spyOn(placeLetterClickService, 'addLetterOnBoard');
        spyOn(letterServiceSpy.players[0], 'handContainLetters').and.returnValue(true);
        placeLetterClickService.placeLetter('a');
        expect(mySpy).toHaveBeenCalled();
    });

    it('placeLetter should add Letter on Board if letter is Capital and player hand contains *', () => {
        placeLetterClickService.isTileSelected = true;
        const mySpy = spyOn(placeLetterClickService, 'addLetterOnBoard');
        spyOn(letterServiceSpy.players[0], 'handContainLetters').and.returnValue(true);
        placeLetterClickService.placeLetter('A');
        expect(mySpy).toHaveBeenCalled();
    });

    it("placeLetter should not add Letter on Board if letter is minuscule and player hand doesn't contains it", () => {
        placeLetterClickService.isTileSelected = true;
        const mySpy = spyOn(placeLetterClickService, 'addLetterOnBoard');
        spyOn(letterServiceSpy.players[0], 'handContainLetters').and.returnValue(false);
        placeLetterClickService.placeLetter('a');
        expect(mySpy).not.toHaveBeenCalled();
    });

    it("placeLetter should not add Letter on Board if letter is Capital and player hand doesn't contains *", () => {
        placeLetterClickService.isTileSelected = true;
        const mySpy = spyOn(placeLetterClickService, 'addLetterOnBoard');
        spyOn(letterServiceSpy.players[0], 'handContainLetters').and.returnValue(false);
        placeLetterClickService.placeLetter('A');
        expect(mySpy).not.toHaveBeenCalled();
    });

    it('addLetterOnBoard should not call anything if letter is at edge', () => {
        placeLetterClickService.isLetterAtEdge = true;
        const mySpy = spyOn(gridServiceSpy, 'drawLetterwithpositionstring');
        placeLetterClickService.addLetterOnBoard('A', true);
        expect(mySpy).not.toHaveBeenCalled();
    });

    it("addLetterOnBoard should call remove letter from hand if letter isn't caps", () => {
        placeLetterClickService.isLetterAtEdge = false;
        const mySpy = spyOn(letterServiceSpy.players[0], 'removeLettersWithoutReplacingThem');
        const mySpy2 = spyOn(placeLetterClickService, 'handleRowAndColumnAfterLetter');
        const mySpy3 = spyOn(gridServiceSpy, 'drawLetterwithpositionstring');
        const mySpy4 = spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.addLetterOnBoard('a', false);
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
        expect(mySpy4).toHaveBeenCalled();
    });

    it('addLetterOnBoard should call remove letter from hand if letter is caps', () => {
        placeLetterClickService.isLetterAtEdge = false;
        const mySpy = spyOn(letterServiceSpy.players[0], 'removeLettersWithoutReplacingThem');
        const mySpy2 = spyOn(placeLetterClickService, 'handleRowAndColumnAfterLetter');
        const mySpy3 = spyOn(gridServiceSpy, 'drawLetterwithpositionstring');
        const mySpy4 = spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.addLetterOnBoard('a', true);
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
        expect(mySpy4).toHaveBeenCalled();
    });

    it('caseSelected should not call anything when not player turn', () => {
        timeManagerSpy.turn = 1;
        const mySpy = spyOn(placeLetterClickService, 'rawXYPositionToCasePosition');
        placeLetterClickService.caseSelected(3, 2);
        expect(mySpy).not.toHaveBeenCalled();
    });

    it('caseSelected should not call anything when not player turn', () => {
        timeManagerSpy.turn = 1;
        const mySpy = spyOn(placeLetterClickService, 'rawXYPositionToCasePosition');
        placeLetterClickService.caseSelected(3, 2);
        expect(mySpy).not.toHaveBeenCalled();
    });

    it('caseSelected should call removeArrowIfNeeded, changeorientation, drawtileBackground and draw arrow if something is already selected', () => {
        timeManagerSpy.turn = 0;
        placeLetterClickService.isTileSelected = true;
        spyOn(placeLetterClickService, 'rawXYPositionToCasePosition').and.returnValue(2);
        const mySpy = spyOn(placeLetterClickService, 'removeArrowIfNeeded');
        const mySpy2 = spyOn(placeLetterClickService, 'changeOrientation');
        const mySpy3 = spyOn(gridServiceSpy, 'drawtilebackground');
        const mySpy4 = spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.caseSelected(3, 2);
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
        expect(mySpy4).toHaveBeenCalled();
    });

    it('caseSelected should not call removeArrowIfNeeded, changeorientation, drawtileBackground and draw arrow if select case with letter', () => {
        timeManagerSpy.turn = 0;
        placeLetterClickService.isTileSelected = true;
        gameStateServiceSpy.lettersOnBoard[2][2] = 'a';
        spyOn(placeLetterClickService, 'rawXYPositionToCasePosition').and.returnValue(2);
        const mySpy = spyOn(placeLetterClickService, 'removeArrowIfNeeded');
        const mySpy2 = spyOn(placeLetterClickService, 'changeOrientation');
        const mySpy3 = spyOn(gridServiceSpy, 'drawtilebackground');
        const mySpy4 = spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.caseSelected(3, 2);
        expect(mySpy).not.toHaveBeenCalled();
        expect(mySpy2).not.toHaveBeenCalled();
        expect(mySpy3).not.toHaveBeenCalled();
        expect(mySpy4).not.toHaveBeenCalled();
    });

    it('caseSelected should not call changeOrientation and drawtileBackground if selecting different case', () => {
        timeManagerSpy.turn = 0;
        placeLetterClickService.isTileSelected = true;
        placeLetterClickService.row = 3;
        placeLetterClickService.colomnNumber = 3;
        spyOn(placeLetterClickService, 'rawXYPositionToCasePosition').and.returnValue(2);
        spyOn(placeLetterClickService, 'removeArrowIfNeeded');
        const mySpy = spyOn(placeLetterClickService, 'changeOrientation');
        const mySpy2 = spyOn(gridServiceSpy, 'drawtilebackground');
        spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.caseSelected(3, 2);
        expect(mySpy).not.toHaveBeenCalled();
        expect(mySpy2).not.toHaveBeenCalled();
    });

    it('handlerowandcolumn should augment the column by 1 after placing letter if board is empty and orientation is h', () => {
        placeLetterClickService.orientation = 'h';
        const numberOfCases = 15;
        placeLetterClickService.row = 14;
        placeLetterClickService.colomnNumber = 14;
        placeLetterClickService.handleRowAndColumnAfterLetter();
        expect(placeLetterClickService.colomnNumber).toEqual(numberOfCases);
    });

    it('handlerowandcolumn should augment the row by 2 after placing letter if board has a letter on the next case and orientation is v', () => {
        placeLetterClickService.orientation = 'v';
        const numberOfCases = 15;
        placeLetterClickService.row = 13;
        placeLetterClickService.colomnNumber = 13;
        gameStateServiceSpy.lettersOnBoard[14][13] = 'a';
        placeLetterClickService.handleRowAndColumnAfterLetter();
        expect(placeLetterClickService.row).toEqual(numberOfCases);
    });

    it('transform into command should call reset', () => {
        const myspy = spyOn(placeLetterClickService, 'reset');
        placeLetterClickService.transformIntoCommand();
        expect(myspy).toHaveBeenCalled();
    });

    it('change orientation should change orientation', () => {
        placeLetterClickService.orientation = 'v';
        placeLetterClickService.changeOrientation();
        expect(placeLetterClickService.orientation).not.toEqual('v');
    });

    it('rawXYPositionToCasePosition should return 14 when 746 is entered', () => {
        const randomNumber = 746;
        const lastCase = 14;
        expect(placeLetterClickService.rawXYPositionToCasePosition(randomNumber)).toEqual(lastCase);
    });

    it('removeLetterWithBackspace should call handleColumnAndRowAfterRemove when orientation is h letteronedge', () => {
        placeLetterClickService.isLetterAtEdge = true;
        placeLetterClickService.orientation = 'h';
        placeLetterClickService.lettersFromHand = 'hello';
        const mySpy = spyOn(placeLetterClickService, 'handleColumnAndRowAfterRemove');
        spyOn(gridServiceSpy, 'drawtilebackground');
        spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.removeLetterWithBackspace();
        expect(mySpy).toHaveBeenCalled();
    });

    it('removeLetterWithBackspace should call handleColumnAndRowAfterRemove when orientation is v letteronedge', () => {
        placeLetterClickService.isLetterAtEdge = true;
        placeLetterClickService.orientation = 'v';
        placeLetterClickService.lettersFromHand = 'hellO';
        const mySpy = spyOn(placeLetterClickService, 'handleColumnAndRowAfterRemove');
        spyOn(gridServiceSpy, 'drawtilebackground');
        spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.removeLetterWithBackspace();
        expect(mySpy).toHaveBeenCalled();
    });

    it('removeLetterWithBackspace should call handleColumnAndRowAfterRemove when orientation is h and previous case is occupied letteronedge', () => {
        placeLetterClickService.isLetterAtEdge = true;
        placeLetterClickService.orientation = 'h';
        gameStateServiceSpy.lettersOnBoard[2][14] = 'a';
        placeLetterClickService.lettersFromHand = 'hello';
        const mySpy = spyOn(placeLetterClickService, 'handleColumnAndRowAfterRemove');
        spyOn(gridServiceSpy, 'drawtilebackground');
        spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.removeLetterWithBackspace();
        expect(mySpy).toHaveBeenCalled();
    });

    it('removeLetterWithBackspace should call handleColumnAndRowAfterRemove when orientation is v and previous case is occupied letteronedge', () => {
        placeLetterClickService.isLetterAtEdge = true;
        placeLetterClickService.orientation = 'v';
        gameStateServiceSpy.lettersOnBoard[14][2] = 'a';
        placeLetterClickService.lettersFromHand = 'hellO';
        const mySpy = spyOn(placeLetterClickService, 'handleColumnAndRowAfterRemove');
        spyOn(gridServiceSpy, 'drawtilebackground');
        spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.removeLetterWithBackspace();
        expect(mySpy).toHaveBeenCalled();
    });

    it('removeLetterWithBackspace should call handleColumnAndRowAfterRemove when orientation is h and previouscase is occupied !letteronedge', () => {
        placeLetterClickService.isLetterAtEdge = false;
        placeLetterClickService.orientation = 'h';
        placeLetterClickService.lettersFromHand = 'hello';
        const mySpy = spyOn(placeLetterClickService, 'handleColumnAndRowAfterRemove');
        spyOn(gridServiceSpy, 'drawtilebackground');
        spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.removeLetterWithBackspace();
        expect(mySpy).toHaveBeenCalled();
    });

    it('removeLetterWithBackspace should call handleColumnAndRowAfterRemove when orientation is v and previouscase is occupied !letteronedge', () => {
        placeLetterClickService.isLetterAtEdge = false;
        placeLetterClickService.orientation = 'v';
        placeLetterClickService.lettersFromHand = 'hellO';
        const mySpy = spyOn(placeLetterClickService, 'handleColumnAndRowAfterRemove');
        spyOn(gridServiceSpy, 'drawtilebackground');
        spyOn(gridServiceSpy, 'drawarrow');
        placeLetterClickService.removeLetterWithBackspace();
        expect(mySpy).toHaveBeenCalled();
    });

    it('handlerowcolumn after remove should reduce by 1 column number when orientation is h', () => {
        placeLetterClickService.wordPlacedWithClick = 'hello';
        gameStateServiceSpy.lettersOnBoard[2][2] = 'a';
        placeLetterClickService.orientation = 'h';
        placeLetterClickService.handleColumnAndRowAfterRemove();
        expect(placeLetterClickService.colomnNumber).toEqual(1);
    });

    it('handlerowcolumn after remove should reduce by 1 row when orientation is v', () => {
        placeLetterClickService.wordPlacedWithClick = 'hello';
        placeLetterClickService.orientation = 'v';
        gameStateServiceSpy.lettersOnBoard[2][2] = 'a';
        placeLetterClickService.handleColumnAndRowAfterRemove();
        expect(placeLetterClickService.row).toEqual(1);
    });

    it('removearrow if needed should call drawtilebackground if last letter entered is Backspace', () => {
        placeLetterClickService.wordPlacedWithClick = 'hello';
        placeLetterClickService.lastKeyPressed = 'Backspace';
        const mySpy = spyOn(gridServiceSpy, 'drawtilebackground');
        placeLetterClickService.removeArrowIfNeeded(2, 2);
        expect(mySpy).toHaveBeenCalled();
    });

    it('remove whole word should call remove arrow if needed', () => {
        placeLetterClickService.lettersFromHand = 'hello';
        spyOn(placeLetterClickService, 'removeLetterWithBackspace');
        const mySpy = spyOn(placeLetterClickService, 'removeArrowIfNeeded');
        placeLetterClickService.removeWholeWord();
        expect(mySpy).toHaveBeenCalled();
    });

    it('reset should call remove whole word', () => {
        placeLetterClickService.isTileSelected = true;
        const mySpy = spyOn(placeLetterClickService, 'removeWholeWord');
        placeLetterClickService.reset();
        expect(mySpy).toHaveBeenCalled();
    });
});
