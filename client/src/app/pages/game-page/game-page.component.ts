import { Component, HostListener } from '@angular/core';
import { ClickManagementService } from '@app/services/click-management.service';
import { FinishGameService } from '@app/services/finish-game.service';

@Component({
    selector: 'app-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
})
export class GamePageComponent {
    constructor(private clickManager: ClickManagementService, private finishGameService: FinishGameService) {}

    @HostListener('contextmenu', ['$event'])
    onRightClick(event: { preventDefault: () => void }) {
        event.preventDefault();
    }

    clickLocation(location: string) {
        this.clickManager.click(location);
    }

    getFinishedGame() {
        return this.finishGameService.isGameFinished;
    }
}
