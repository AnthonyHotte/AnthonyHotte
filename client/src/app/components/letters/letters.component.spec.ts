import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LettersComponent } from '@app/components/letters/letters.component';
import { LetterService } from '@app/services/letter.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { SoloPlayerService } from '@app/services/solo-player.service';

describe('LettersComponent', () => {
    let component: LettersComponent;
    let fixture: ComponentFixture<LettersComponent>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let soloPlayerServiceSpy: jasmine.SpyObj<SoloPlayerService>;
    let soloOpponentServiceSpy: jasmine.SpyObj<SoloOpponentService>;

    beforeEach(
        waitForAsync(() => {
            TestBed.configureTestingModule({
                declarations: [LettersComponent],
                // providers: [
                //     { provide: SoloPlayerService, useValue: soloPlayerServiceSpy },
                //     { provide: SoloOpponentService, useValue: soloOpponentServiceSpy },
                //     { provide: LetterService, useValue: letterServiceSpy },
                // ],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(LettersComponent);
        letterServiceSpy = TestBed.inject(LetterService) as jasmine.SpyObj<LetterService>;
        soloPlayerServiceSpy = TestBed.inject(SoloPlayerService) as jasmine.SpyObj<SoloPlayerService>;
        soloOpponentServiceSpy = TestBed.inject(SoloOpponentService) as jasmine.SpyObj<SoloOpponentService>;

        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('getNewLetters should call soloPlayerReset', () => {
        const mySpy = spyOn(soloPlayerServiceSpy, 'reset');
        const mySpy2 = spyOn(soloOpponentServiceSpy, 'reset');
        const amount = 10;
        component.message = 'awdadawdwad';
        component.currentLetterNumber = 0;
        component.maxLettersInHand = 12;
        component.getNewLetters(amount);
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(component.letters).toEqual(letterServiceSpy.players[0].allLettersInHand);
        expect(component.currentLetterNumber).toEqual(parseInt(component.message, 10));
    });
});
