import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TileMap } from '@app/classes/grid-special-tile';
import { Position } from '@app/position-tile-interface';
import { IndexWaitingRoomService } from '@app/services/index-waiting-room.service';
import { LetterService } from '@app/services/letter.service';
import { SocketService } from '@app/services/socket.service';
import { OpponentWaitingRoomComponent } from './opponent-waiting-room.component';

describe('OpponentWaitingRoomComponent', () => {
    let component: OpponentWaitingRoomComponent;
    let fixture: ComponentFixture<OpponentWaitingRoomComponent>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;
    let indexWaitingRoomServiceSpy: jasmine.SpyObj<IndexWaitingRoomService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let gridMapServiceSpy: jasmine.SpyObj<TileMap>;
    beforeEach(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketService', ['sendGameListNeededNotification', 'handleDisconnect']);
        indexWaitingRoomServiceSpy = jasmine.createSpyObj('IndexWaitingRoomService', ['setIndex']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['synchInformation']);
        gridMapServiceSpy = jasmine.createSpyObj('TileMap', ['isDoubleWordTile']);
        socketServiceSpy.gameLists = [['1', '2', '3', '4', '5', '6', '7', 'true']];
        await TestBed.configureTestingModule({
            declarations: [OpponentWaitingRoomComponent],
            providers: [
                { provide: IndexWaitingRoomService, useValue: indexWaitingRoomServiceSpy },
                { provide: SocketService, useValue: socketServiceSpy },
                { provide: LetterService, useValue: letterServiceSpy },
                { provide: TileMap, useValue: gridMapServiceSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(OpponentWaitingRoomComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('setIndex should call synchInformation ', () => {
        socketServiceSpy.boards = [];
        socketServiceSpy.boards.push([
            [{ positionX: 1, positionY: 3 }],
            [{ positionX: 1, positionY: 3 }],
            [{ positionX: 1, positionY: 3 }],
            [{ positionX: 1, positionY: 3 }],
        ]);
        gridMapServiceSpy.tileMap = new Map<string, Position[]>();
        gridMapServiceSpy.tileMap.set('allo', [{ positionX: 1, positionY: 3 }]);
        spyOn(gridMapServiceSpy.tileMap, 'set');
        component.setIndex(0);
        expect(letterServiceSpy.synchInformation).toHaveBeenCalled();
    });

    it('fillList should call push ', () => {
        socketServiceSpy.gameLists.push(['1', '2', '3', 'Four', 'Five', 'Six', 'Seven', 'letters']);
        socketServiceSpy.is2990 = true;
        component.fillList();
        expect(component.gamesList[1]).toEqual(['1', '2', '3', 'letters']);
    });
    it('changeValidity should change validty when true', () => {
        component.isValidSelection = true;
        component.changeValidity('hello');
        expect(component.isValidSelection).toBeFalse();
    });

    it('changeValidity should change validty when false', () => {
        component.isValidSelection = false;
        component.changeValidity('hello');
        expect(component.isValidSelection).toBeTrue();
    });

    it('refresh should call sendGameListNeededNotification and fillGamesList', () => {
        const mySpy = spyOn(component, 'fillGamesList');
        component.refresh();
        expect(socketServiceSpy.sendGameListNeededNotification).toHaveBeenCalled();
        expect(mySpy).toHaveBeenCalled();
    });

    it('getBonus should return oui if true', () => {
        expect(component.getBonusInLetters('true')).toEqual('Oui');
    });

    it('getBonus should return non if not true', () => {
        expect(component.getBonusInLetters('false')).toEqual('Non');
    });
    it('getTimePerTurn should parse time to int', () => {
        expect(component.getTimePerTurn('2')).toEqual(2);
    });
    it('changeStringToBool2990 should parse int to bool', () => {
        expect(component.changeStringToBool2990('true')).toEqual(true);
    });
    it('changeStringToBool2990 should parse int to bool', () => {
        socketServiceSpy.is2990 = true;
        expect(component.getIs2990()).toEqual(true);
    });
    it('joinRandom should parse int to bool', () => {
        socketServiceSpy.is2990 = true;
        socketServiceSpy.gameLists.push(['1', '2', '3', '4', '5', '6', '7', 'false']);
        const spy = spyOn(component, 'setIndex');
        component.joinRandom();
        expect(spy).toHaveBeenCalledWith(0);
    });
    it('should call handleDisconnect', () => {
        component.beforeUnloadHandler();
        expect(socketServiceSpy.handleDisconnect).toHaveBeenCalled();
    });
});
