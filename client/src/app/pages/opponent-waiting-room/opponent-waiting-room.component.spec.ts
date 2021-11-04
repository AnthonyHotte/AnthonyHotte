import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
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

    beforeEach(async () => {
        socketServiceSpy = jasmine.createSpyObj('SocketService', ['sendGameListNeededNotification']);
        indexWaitingRoomServiceSpy = jasmine.createSpyObj('IndexWaitingRoomService', ['setIndex']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['synchLetters']);
        socketServiceSpy.gameLists = [['name', 'bonus', 'time', 'letters']];
        await TestBed.configureTestingModule({
            declarations: [OpponentWaitingRoomComponent],
            providers: [
                { provide: IndexWaitingRoomService, useValue: indexWaitingRoomServiceSpy },
                { provide: SocketService, useValue: socketServiceSpy },
                { provide: LetterService, useValue: letterServiceSpy },
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

    it('setIndex should call synchLetters ', () => {
        component.setIndex(0);
        expect(letterServiceSpy.synchLetters).toHaveBeenCalled();
    });

    it('fillList should call push ', () => {
        socketServiceSpy.gameLists.push(['1', '2', '3', '4']);
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
});
