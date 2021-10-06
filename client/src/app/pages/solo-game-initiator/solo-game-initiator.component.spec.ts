import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoloGameInitiatorComponent } from './solo-game-initiator.component';

describe('SoloGameInitiatorComponent', () => {
    let component: SoloGameInitiatorComponent;
    let fixture: ComponentFixture<SoloGameInitiatorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SoloGameInitiatorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloGameInitiatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('verifyName should call assignOpponentName', () => {
        const mySpy2 = spyOn(component, 'assignOpponentName');
        const mySpy3 = spyOn(component, 'switchOpponentName');
        component.verifyNames();
        expect(mySpy2).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
    });
    it('verifyName should set nameIsValid at false', () => {
        component.temporaryName = 'sdfsdfsdfsdfsdfsdfsdfsdfsdsfsdfsdfsdfdsfdsfsdfsdfsdfsdfsdfsdf';
        component.verifyNames();
        expect(component.nameIsValid).toBe(false);
    });
    it('verifyName should set nameIsValid at true', () => {
        component.temporaryName = 'sdfsd';
        component.verifyNames();
        expect(component.nameIsValid).toBe(true);
    });
    it('verifyName should set nameIsValid at false in the else', () => {
        component.temporaryName = 'sdfsd123';
        component.verifyNames();
        expect(component.nameIsValid).toBe(false);
    });
    it('setName should put this.temporaryname in this.name', () => {
        component.temporaryName = 'sdfsd';
        component.setName();
        expect(component.name).toBe(component.temporaryName);
    });
    it('setName should put joueur in this.name', () => {
        component.temporaryName = 'sdfsd3';
        component.setName();
        const j = 'Joueur';
        expect(component.name).toBe(j);
    });
    it('nameValidity should return valide ', () => {
        component.nameIsValid = true;
        const retour = component.nameValidityInChar();
        const val = 'valide';
        expect(retour).toBe(val);
    });
    it('nameValidity should return invalide ', () => {
        component.nameIsValid = false;
        const retour = component.nameValidityInChar();
        const val = 'invalide';
        expect(retour).toBe(val);
    });
    it('switchOpponentName should enter in case 1', () => {
        component.opponentName = 'abcd';
        const temp = 'abcd';
        component.idNameOpponent = 1;
        const retour = 'Daphne du Maurier';
        component.switchOpponentName(temp);
        expect(component.opponentName).toBe(retour);
    });
    it('switchOpponentName should enter in case 2', () => {
        component.opponentName = 'abcd';
        const temp = 'abcd';
        component.idNameOpponent = 2;
        const retour = 'Jane Austen';
        component.switchOpponentName(temp);
        expect(component.opponentName).toBe(retour);
    });
    it('switchOpponentName should enter in default', () => {
        component.opponentName = 'abcd';
        const temp = 'abcd';
        component.idNameOpponent = 3;
        const retour = 'Haruki Murakami';
        component.switchOpponentName(temp);
        expect(component.opponentName).toBe(retour);
    });
});
