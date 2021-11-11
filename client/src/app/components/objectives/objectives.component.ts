import { Component, OnInit } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { ObjectivesService } from '@app/services/objectives.service';
import { SocketService } from '@app/services/socket.service';

@Component({
    selector: 'app-objectives',
    templateUrl: './objectives.component.html',
    styleUrls: ['./objectives.component.scss'],
})
export class ObjectivesComponent implements OnInit {
    objCompleted: number[] = [];
    objCompletor: number[] = [];
    constructor(private letterService: LetterService, private socketService: SocketService, private objectiveService: ObjectivesService) {}
    ngOnInit() {
        this.objCompleted = this.letterService.objCompleted;
        this.objCompletor = this.letterService.objCompletor;
    }
    getObjective(index: number) {
        if (!this.letterService.objCompleted.includes(this.letterService.players[0].objectives[index])) {
            return (this.objectiveService.objectiveMap.get(this.letterService.players[0].objectives[index]) +
                ' : ' +
                this.objectiveService.objectivePoint.get(this.letterService.players[0].objectives[index]) +
                ' points') as string;
        }
        return '';
    }

    getSingleObjCompleted(obj: number) {
        return (
            ((this.objectiveService.objectiveMap.get(obj) + ' : ' + this.objectiveService.objectivePoint.get(obj) + ' points.') as string) +
            ' Complété par '
        );
    }

    getGameMode() {
        return this.socketService.is2990;
    }

    publicLeft() {
        for (let i = 0; i < 2; i++) {
            if (!this.letterService.objCompleted.includes(this.letterService.players[0].objectives[i])) {
                return true;
            }
        }
        return false;
    }

    privateLeft() {
        if (!this.letterService.objCompleted.includes(this.letterService.players[0].objectives[2])) {
            return true;
        }
        return false;
    }

    areSomeCompleted() {
        return this.letterService.objCompleted.length !== 0;
    }

    getObjCompleted() {
        return this.letterService.objCompleted;
    }

    getObjCompletor() {
        return this.letterService.objCompletor;
    }

    getPlayerName(index: number) {
        return this.letterService.players[index].name;
    }
}
