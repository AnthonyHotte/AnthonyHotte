import { Component } from '@angular/core';
import { GridService } from '@app/services/grid.service';
import { PlaceLettersService } from '@app/services/place-letters.service';

@Component({
    selector: 'app-change-font-size',
    templateUrl: './change-font-size.component.html',
    styleUrls: ['./change-font-size.component.scss'],
})
export class ChangeFontSizeComponent {
    constructor(private gridService: GridService, private placeLetterService: PlaceLettersService) {}

    increaseFontSize() {
        this.gridService.increasePoliceSize();
        this.placeLetterService.policeSizeChanged();
    }
    decreaseFontSize() {
        this.gridService.decreasePoliceSize();
        this.placeLetterService.policeSizeChanged();
    }
}
