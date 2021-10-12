import { Component, ViewChild } from '@angular/core';
import { InitiateGameTypeService } from '@app/services/initiate-game-type.service';

@Component({
    selector: 'app-waiting-room',
    templateUrl: './waiting-room.component.html',
    styleUrls: ['./waiting-room.component.scss'],
})
export class WaitingRoomComponent {
    @ViewChild('virtualPlayerLevel') virtalPlayerDiv!: HTMLDivElement;
    constructor(private initiateTypeGame: InitiateGameTypeService) {}
    showChoice() {
        this.virtalPlayerDiv.style.display = 'block';
    }
    setTypeGame() {
        this.initiateTypeGame.setGameType('solo', false);
    }
}
