import { AfterViewInit, Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { Vec2 } from '@app/classes/vec2';
import * as Constants from '@app/constants';
import { ClickManagementService } from '@app/services/click-management.service';
import { GridService } from '@app/services/grid.service';
import { LetterService } from '@app/services/letter.service';
import { PlaceLetterClickService } from '@app/services/place-letter-click.service';
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

    constructor(
        private readonly gridService: GridService,
        private letterService: LetterService,
        private placeLetterClickService: PlaceLetterClickService,
        private placeLetterService: PlaceLettersService,
        private textBox: TextBox,
        private clickManager: ClickManagementService,
    ) {}

    @HostListener('window:keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        if (this.clickManager.activeLocation === 'gameBoard') {
            this.placeLetterClickService.placeLetter(event.key);
            if (event.key === 'Enter' && this.placeLetterClickService.wordPlacedWithClick.length !== 0) {
                const command = this.placeLetterService.submitWordMadeClick();
                this.textBox.send(command);
                this.textBox.isCommand(command.message);
            }
        } else if (this.clickManager.activeLocation === 'hand') {
            this.letterService.setIndexSelectedSwapping(event.key);
        }
    }

    @HostListener('window:mousewheel', ['$event'])
    onWindowScroll(event: WheelEvent) {
        if (this.clickManager.activeLocation === 'hand') {
            if (event.deltaY > 0) {
                this.letterService.setIndexSelectedSwapping('ArrowLeft');
            } else if (event.deltaY < 0) {
                this.letterService.setIndexSelectedSwapping('ArrowRight');
            }
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
        if (event.button === MouseButton.Left && this.clickManager.activeLocation === 'hand') {
            this.mousePosition = { x: event.offsetX, y: event.offsetY };
            // eslint-disable-next-line @typescript-eslint/no-magic-numbers
            // this.gridService.drawarrow('v', 5, 5);
            this.placeLetterClickService.caseSelected(this.mousePosition.x, this.mousePosition.y);
        }
    }
}
