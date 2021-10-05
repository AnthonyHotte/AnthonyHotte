import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { LettersComponent } from '@app/components/letters/letters.component';
import { LetterService } from '@app/services/letter.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';

describe('LettersComponent', () => {
    let component: LettersComponent;
    let fixture: ComponentFixture<LettersComponent>;
    let routerSpy: jasmine.SpyObj<Router>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let soloOpponentServiceSpy: jasmine.SpyObj<SoloOpponentService>;

    beforeEach(
        waitForAsync(() => {
            routerSpy = jasmine.createSpyObj('Router', ['navigate']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
            letterServiceSpy.players = [new PlayerLetterHand(), new PlayerLetterHand()];
            soloOpponentServiceSpy = jasmine.createSpyObj('SoloOpponentService', ['reset']);
            TestBed.configureTestingModule({
                declarations: [LettersComponent],
                providers: [
                    { provide: Router, useValue: routerSpy },
                    { provide: SoloOpponentService, useValue: soloOpponentServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                ],
                imports: [RouterTestingModule],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(LettersComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('getNewLetters get letter og player 0', () => {
        component.letters = [];
        letterServiceSpy.players[0].allLettersInHand = [{ letter: 'a', quantity: 1, point: 1 }];
        component.getNewLetters();
        expect(component.letters.length).toEqual(1);
    });
});
