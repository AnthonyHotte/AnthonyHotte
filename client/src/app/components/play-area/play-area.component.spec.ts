import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TextBox } from '@app/classes/text-box-behavior';
import { Vec2 } from '@app/classes/vec2';
import { PlayAreaComponent } from '@app/components/play-area/play-area.component';
import { ClickManagementService } from '@app/services/click-management.service';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterClickService } from '@app/services/place-letter-click.service';
import { PlaceLettersService } from '@app/services/place-letters.service';

describe('PlayAreaComponent', () => {
    let component: PlayAreaComponent;
    let fixture: ComponentFixture<PlayAreaComponent>;
    let mouseEvent: MouseEvent;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let placeLetterClickServiceSpy: jasmine.SpyObj<PlaceLetterClickService>;
    let placeLetterServiceSpy: jasmine.SpyObj<PlaceLettersService>;
    let textBoxSpy: jasmine.SpyObj<TextBox>;
    let routerSpy: jasmine.SpyObj<Router>;
    let clickManagerSpy: jasmine.SpyObj<ClickManagementService>;

    beforeEach(async () => {
        gridServiceSpy = jasmine.createSpyObj('GridService', ['increasePoliceSize', 'drawGrid']);
        placeLetterServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['submitWordMadeClick']);
        placeLetterClickServiceSpy = jasmine.createSpyObj('PlaceLetterClickService', ['reset', 'caseSelected', 'placeLetter']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        textBoxSpy = jasmine.createSpyObj('TextBox', ['send', 'isCommand']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange', 'reset', 'setIndexSelectedSwapping']);
        clickManagerSpy = jasmine.createSpyObj('ClickManagementService', ['click', 'manageView']);

        await TestBed.configureTestingModule({
            declarations: [PlayAreaComponent],
            providers: [
                { provide: GridService, useValue: gridServiceSpy },
                { provide: LetterService, useValue: letterServiceSpy },
                { provide: PlaceLetterClickService, useValue: placeLetterClickServiceSpy },
                { provide: PlaceLettersService, useValue: placeLetterServiceSpy },
                { provide: TextBox, useValue: textBoxSpy },
                { provide: ClickManagementService, useValue: clickManagerSpy },
                { provide: Router, useValue: routerSpy },
            ],
            imports: [RouterTestingModule],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(PlayAreaComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('mouseHitDetect should assign the mouse position to mousePosition variable', () => {
        const expectedPosition: Vec2 = { x: 100, y: 200 };
        mouseEvent = {
            offsetX: expectedPosition.x,
            offsetY: expectedPosition.y,
            button: 0,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent);
        expect(component.mousePosition).toEqual(expectedPosition);
    });

    it('mouseHitDetect should not change the mouse position if it is not a left click', () => {
        const expectedPosition: Vec2 = { x: 0, y: 0 };
        const mouseMoved: Vec2 = { x: 10, y: 10 };
        mouseEvent = {
            offsetX: expectedPosition.x + mouseMoved.x,
            offsetY: expectedPosition.y + mouseMoved.y,
            button: 1,
        } as MouseEvent;
        component.mouseHitDetect(mouseEvent);
        expect(component.mousePosition).not.toEqual({ x: mouseEvent.offsetX, y: mouseEvent.offsetY });
        expect(component.mousePosition).toEqual(expectedPosition);
    });

    it('button detect should call submitWordMadeClick if location is gameBoard and keydown is enter ', () => {
        clickManagerSpy.activeLocation = 'gameBoard';
        placeLetterClickServiceSpy.wordPlacedWithClick = 'hello';
        const event = new KeyboardEvent('keydown', { key: 'Enter' });
        placeLetterServiceSpy.submitWordMadeClick.and.returnValue({ message: '!placer h8h allo', sender: 'Salut', role: 'Joueur' });
        component.buttonDetect(event);
        expect(placeLetterServiceSpy.submitWordMadeClick).toHaveBeenCalled();
    });

    it('button detect should call submitWordMadeClick if location is gameBoard and keydown is Escape ', () => {
        clickManagerSpy.activeLocation = 'gameBoard';
        const event = new KeyboardEvent('keydown', { key: 'Escape' });
        component.buttonDetect(event);
        expect(placeLetterClickServiceSpy.reset).toHaveBeenCalled();
    });

    it('button detect should call placeLetter if location is gameBoard and keydown is a letter ', () => {
        clickManagerSpy.activeLocation = 'gameBoard';
        const event = new KeyboardEvent('keydown', { key: 'a' });
        component.buttonDetect(event);
        expect(placeLetterClickServiceSpy.placeLetter).toHaveBeenCalled();
    });

    it('button detect should call setIndexSelectedSwapping if location is hand and keydown is letter ', () => {
        clickManagerSpy.activeLocation = 'hand';
        const event = new KeyboardEvent('keydown', { key: 'a' });
        component.buttonDetect(event);
        expect(letterServiceSpy.setIndexSelectedSwapping).toHaveBeenCalled();
    });

    it('button detect should not call anything setIndexSelectedSwapping if location is not hand or gameBoard ', () => {
        clickManagerSpy.activeLocation = 'textBox';
        const event = new KeyboardEvent('keydown', { key: 'a' });
        component.buttonDetect(event);
        expect(letterServiceSpy.setIndexSelectedSwapping).not.toHaveBeenCalled();
        expect(placeLetterClickServiceSpy.reset).not.toHaveBeenCalled();
        expect(placeLetterServiceSpy.submitWordMadeClick).not.toHaveBeenCalled();
        expect(placeLetterClickServiceSpy.placeLetter).not.toHaveBeenCalled();
    });

    it('onWindowScroll should call setIndexSelectedSwapping if location is hand and wheel goes up', () => {
        clickManagerSpy.activeLocation = 'hand';
        const event = new WheelEvent('wheel', { deltaY: 1 });
        component.onWindowScroll(event);
        expect(letterServiceSpy.setIndexSelectedSwapping).toHaveBeenCalled();
    });

    it('onWindowScroll should call setIndexSelectedSwapping if location is hand and wheel goes down', () => {
        clickManagerSpy.activeLocation = 'hand';
        const event = new WheelEvent('wheel', { deltaY: -1 });
        component.onWindowScroll(event);
        expect(letterServiceSpy.setIndexSelectedSwapping).toHaveBeenCalled();
    });

    it('onWindowScroll should not call setIndexSelectedSwapping if location is hand and wheel does not go up or down', () => {
        clickManagerSpy.activeLocation = 'hand';
        const event = new WheelEvent('wheel', { deltaY: 0 });
        component.onWindowScroll(event);
        expect(letterServiceSpy.setIndexSelectedSwapping).not.toHaveBeenCalled();
    });

    it('onWindowScroll should not call setIndexSelectedSwapping if location is not hand', () => {
        clickManagerSpy.activeLocation = 'gameBoard';
        const event = new WheelEvent('wheel', { deltaY: 1 });
        component.onWindowScroll(event);
        expect(letterServiceSpy.setIndexSelectedSwapping).not.toHaveBeenCalled();
    });
});
