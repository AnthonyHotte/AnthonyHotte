import { Component } from '@angular/core';
import { ClickManagementService } from '@app/services/click-management.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(private clickManager: ClickManagementService) {}

    clickLocation(location: string) {
        this.clickManager.click(location);
    }
}
