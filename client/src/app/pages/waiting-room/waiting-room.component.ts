import { Component } from '@angular/core';
import { InitiateGameTypeService } from '@app/services/initiate-game-type.service';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent {
    constructor(private initiateGameTypeService: InitiateGameTypeService) {}
    setSoloType() {
        this.initiateGameTypeService.setGameType('solo', true);
    }
}
