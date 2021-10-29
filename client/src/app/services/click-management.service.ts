import { Injectable } from '@angular/core';
import { LetterService } from './letter.service';
import { PlaceLetterClickService } from './place-letter-click.service';

@Injectable({
    providedIn: 'root',
})
export class ClickManagementService {
    activeLocation = '';
    constructor(private letterService: LetterService, private placeLetterServiceClick: PlaceLetterClickService) {}
    click(location: string) {
        this.activeLocation = location;
        this.manageView();
    }

    manageView() {
        switch (this.activeLocation) {
            case 'textBox': {
                this.placeLetterServiceClick.reset();
                this.letterService.removeAttributesExchange();
                this.letterService.removeAttributesSwapping();
                break;
            }
            case 'hand': {
                this.placeLetterServiceClick.reset();
                break;
            }
            case 'gameBoard': {
                this.letterService.removeAttributesExchange();
                this.letterService.removeAttributesSwapping();
                break;
            }
            default: {
                this.letterService.removeAttributesExchange();
                this.letterService.removeAttributesSwapping();
            }
        }
    }
}
