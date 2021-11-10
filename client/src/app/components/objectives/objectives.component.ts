import { Component } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { ObjectivesService } from '@app/services/objectives.service';
import { SocketService } from '@app/services/socket.service';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent {
    constructor(private letterService: LetterService, private socketService: SocketService) {}

    getObjective(index: number) {
        return ObjectivesService.objectives.objectiveMap.get(this.letterService.players[0].objectives[index]);
    }

    getPointObjective(index: number) {
        return ObjectivesService.objectives.objectivePoint.get(this.letterService.players[0].objectives[index]);
    }

    getGameMode() {
        return this.socketService.is2990;
    }
}
