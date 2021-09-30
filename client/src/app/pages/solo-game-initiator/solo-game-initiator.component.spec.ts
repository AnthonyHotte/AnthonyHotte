import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SoloGameInformationService } from '@app/services/solo-game-information.service';
import { SoloGameInitiatorComponent } from './solo-game-initiator.component';

describe('SoloGameInitiatorComponent', () => {
    let component: SoloGameInitiatorComponent;
    let fixture: ComponentFixture<SoloGameInitiatorComponent>;
    let information: jasmine.SpyObj<SoloGameInformationService>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [SoloGameInitiatorComponent],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SoloGameInitiatorComponent);
        information = TestBed.inject(SoloGameInformationService) as jasmine.SpyObj<SoloGameInformationService>;
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('sendMessage should call assign opponent name', () => {
        const mySpy = spyOn(component, 'assignOpponentName');
        component.easyDifficulty = true;
        const mySpy2 = spyOn(component.message, 'push');
        component.name = 'adasd';
        component.opponentName = 'adsasd';
        component.playTime = 10;
        const playtimetest = 10;
        component.sendMessage();
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalledWith(component.name, component.opponentName, 'true', String(playtimetest));
    });
    it('sendMessage should call sendMessage of information', () => {
        const mySpy = spyOn(information, 'sendMessage');
        component.sendMessage();
        expect(mySpy).toHaveBeenCalled();
    });
});
