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
        placeLetterServiceSpy = jasmine.createSpyObj('PlaceLettersService', ['policeSizeChanged']);
        placeLetterClickServiceSpy = jasmine.createSpyObj('PlaceLetterClickService', ['reset', 'caseSelected']);
        routerSpy = jasmine.createSpyObj('Router', ['navigate']);
        textBoxSpy = jasmine.createSpyObj('TextBox', ['send', 'isCommand']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['getLettersForExchange', 'reset']);
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
});
