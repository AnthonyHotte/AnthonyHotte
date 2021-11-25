import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { ObjectivesService } from '@app/services/objectives.service';
import { SocketService } from '@app/services/socket.service';

import { ObjectivesComponent } from './objectives.component';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';

describe('ObjectivesComponent', () => {
    let component: ObjectivesComponent;
    let fixture: ComponentFixture<ObjectivesComponent>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let socketServiceSpy: jasmine.SpyObj<SocketService>;
    let objectiveServiceSpy: jasmine.SpyObj<ObjectivesService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;

    beforeEach(async () => {
        letterServiceSpy = jasmine.createSpyObj(LetterService, ['reset']);
        socketServiceSpy = jasmine.createSpyObj(SocketService, ['getMessageObservable']);
        objectiveServiceSpy = jasmine.createSpyObj(ObjectivesService, ['palindrome7']);
        letterBankServiceSpy = jasmine.createSpyObj(LetterBankService, ['getLettersInBank']);
        letterBankServiceSpy.letterBank = [];
        for (let i = 0; i < 3; i++) {
            letterBankServiceSpy.letterBank.push({ letter: 'A', quantity: 9, point: 1 });
        }
        const player1 = new PlayerLetterHand(letterBankServiceSpy);
        player1.objectives = [0, 1, 2];

        const player2 = new PlayerLetterHand(letterBankServiceSpy);
        player2.objectives = [0, 1, 3];
        letterServiceSpy.players = [player1, player2];
        letterServiceSpy.objCompleted = [1, 3];
        letterServiceSpy.objCompletor = [0, 1];
        objectiveServiceSpy.objectiveMap = new Map<number, string>();
        objectiveServiceSpy.objectivePoint = new Map<number, number>();
        objectiveServiceSpy.objectiveMap.set(0, 'obj 0');
        objectiveServiceSpy.objectiveMap.set(1, 'obj 1');
        objectiveServiceSpy.objectiveMap.set(2, 'obj 2');
        objectiveServiceSpy.objectiveMap.set(3, 'obj 3');
        objectiveServiceSpy.objectivePoint.set(0, 2);
        objectiveServiceSpy.objectivePoint.set(1, 2);
        objectiveServiceSpy.objectivePoint.set(3, 2);
        objectiveServiceSpy.objectivePoint.set(2, 2);

        await TestBed.configureTestingModule({
            declarations: [ObjectivesComponent],
            providers: [
                { provide: LetterService, useValue: letterServiceSpy },
                { provide: SocketService, useValue: socketServiceSpy },
                { provide: ObjectivesService, useValue: objectiveServiceSpy },
                { provide: LetterBankService, useValue: letterBankServiceSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ObjectivesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getObjective should return empy string if obj is completed', () => {
        expect(component.getObjective(1)).toEqual('');
    });

    it('getObjective should call get if obj is not completed', () => {
        const mySpy = spyOn(objectiveServiceSpy.objectiveMap, 'get');
        component.getObjective(0);
        expect(mySpy).toHaveBeenCalled();
    });

    it('getSingleObjCompleted should call get', () => {
        const mySpy = spyOn(objectiveServiceSpy.objectiveMap, 'get');
        component.getSingleObjCompleted(0);
        expect(mySpy).toHaveBeenCalled();
    });

    it('getGameMode should return game mode ', () => {
        socketServiceSpy.is2990 = true;
        expect(component.getGameMode()).toBeTrue();
    });

    it('publicLeft should return true if one public objective is not completed', () => {
        expect(component.publicLeft()).toBeTrue();
    });

    it('publicLeft should return false if no public objective is not completed', () => {
        letterServiceSpy.objCompleted = [0, 1, 2, 3];
        expect(component.publicLeft()).toBeFalse();
    });

    it('privateLeft should return true if the private objective is not completed', () => {
        expect(component.privateLeft()).toBeTrue();
    });

    it('privateLeft should return false if the  private objective is completed', () => {
        letterServiceSpy.objCompleted = [0, 1, 2, 3];
        expect(component.privateLeft()).toBeFalse();
    });

    it('areSomeCompleted should return true if there are obj completed', () => {
        expect(component.areSomeCompleted()).toBeTrue();
    });

    it('getObjCompleted should return objCompleted', () => {
        expect(component.getObjCompleted()).toEqual(letterServiceSpy.objCompleted);
    });

    it('getObjCompletor should return objCompletor', () => {
        expect(component.getObjCompletor()).toEqual(letterServiceSpy.objCompletor);
    });

    it('getPlayerName should return playerName', () => {
        letterServiceSpy.players[0].name = 'hello';
        expect(component.getPlayerName(0)).toEqual('hello');
    });
});
