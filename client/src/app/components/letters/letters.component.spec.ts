import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { LettersComponent } from '@app/components/letters/letters.component';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { SoloOpponentService } from '@app/services/solo-opponent.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

describe('LettersComponent', () => {
    let component: LettersComponent;
    let fixture: ComponentFixture<LettersComponent>;
    let routerSpy: jasmine.SpyObj<Router>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let soloOpponentServiceSpy: jasmine.SpyObj<SoloOpponentService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let timeManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;

    beforeEach(
        waitForAsync(() => {
            routerSpy = jasmine.createSpyObj('Router', ['navigate']);
            timeManagerSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', [
                'reset',
                'removeAttributesExchange',
                'leftClickOnLetter',
                'removeAttributesSwapping',
                'rightClickOnLetter',
            ]);
            letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
            letterServiceSpy.players = [new PlayerLetterHand(letterBankServiceSpy), new PlayerLetterHand(letterBankServiceSpy)];
            soloOpponentServiceSpy = jasmine.createSpyObj('SoloOpponentService', ['reset']);
            TestBed.configureTestingModule({
                declarations: [LettersComponent],
                providers: [
                    { provide: Router, useValue: routerSpy },
                    { provide: SoloOpponentService, useValue: soloOpponentServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: LetterBankService, useValue: letterBankServiceSpy },
                    { provide: TimerTurnManagerService, useValue: timeManagerSpy },
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

    it('should call reset when gameStatus === 2', () => {
        timeManagerSpy.gameStatus = 2;
        component.ngOnInit();
        expect(letterServiceSpy.reset).toHaveBeenCalled();
    });

    it('getIndexSelectedSwapping should return indexSelectedSwapping', () => {
        letterServiceSpy.indexSelectedSwapping = 2;
        expect(component.getIndexSelectedSwapping()).toEqual(2);
    });

    it('getIndexSelectedExchange should return indexSelectedExcahgne', () => {
        letterServiceSpy.indexSelectedExchange = [1, 2];
        expect(component.getIndexSelectedExchange()).toEqual([1, 2]);
    });

    it('selectLetterWithLeftClick should call removeAttributesExchange and leftClickOnLetter', () => {
        component.selectLetterWithLeftClick('a', 1);
        expect(letterServiceSpy.removeAttributesExchange).toHaveBeenCalled();
        expect(letterServiceSpy.leftClickOnLetter).toHaveBeenCalled();
    });

    it('selectLetterWithRightClick should call removeAttributesSwapping and rightClickOnLetter', () => {
        component.selectLetterWithRightClick('a', 1);
        expect(letterServiceSpy.removeAttributesSwapping).toHaveBeenCalled();
        expect(letterServiceSpy.rightClickOnLetter).toHaveBeenCalled();
    });
});
