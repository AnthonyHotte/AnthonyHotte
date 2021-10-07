import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { Vec2 } from '@app/classes/vec2';
import * as Constants from '@app/constants';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLettersService } from '@app/services/place-letters.service';

export const DEFAULT_WIDTH = Constants.DEFAULT_WIDTH;
export const DEFAULT_HEIGHT = Constants.DEFAULT_WIDTH;
export enum MouseButton {
    Left = 0,
    Middle = 1,
    Right = 2,
    Back = 3,
    Forward = 4,
}

@Component({
    selector: 'app-play-area',
    templateUrl: './play-area.component.html',
    styleUrls: ['./play-area.component.scss'],
})
export class PlayAreaComponent implements AfterViewInit {
    @ViewChild('gridCanvas', { static: false }) private gridCanvas!: ElementRef<HTMLCanvasElement>;

    mousePosition: Vec2 = { x: 0, y: 0 };
    private canvasSize = { x: DEFAULT_WIDTH, y: DEFAULT_HEIGHT };

    constructor(private readonly gridService: GridService, private letterService: LetterService, private placeLettersService: PlaceLettersService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.letterService.setIndexSelectedSwapping(event.key);
        this.placeLettersService.placeLetter(event.key);
    }

    @HostListener('mousewheel', ['$event'])
    onWindowScroll(event: WheelEvent) {
        if (event.deltaY > 0) {
            this.letterService.setIndexSelectedSwapping('ArrowLeft');
        } else if (event.deltaY < 0) {
            this.letterService.setIndexSelectedSwapping('ArrowRight');
        }
    }

    ngAfterViewInit(): void {
        this.gridService.gridContext = this.gridCanvas.nativeElement.getContext('2d') as CanvasRenderingContext2D;
        this.gridService.drawGrid();
        this.gridCanvas.nativeElement.focus();
    }

    get width(): number {
        return this.canvasSize.x;
    }

    get height(): number {
        return this.canvasSize.y;
    }

    mouseHitDetect(event: MouseEvent) {
        if (event.button === MouseButton.Left) {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            // this.gridService.drawarrow('v', 5, 5);
            this.placeLettersService.caseSelected(this.mousePosition.x, this.mousePosition.y);
        }
    }
}
