import { Component, OnInit } from '@angular/core';
import { SocketService } from '@app/services/socket.service';

@Component({
    selector: 'app-opponent-waiting-room',
    templateUrl: './opponent-waiting-room.component.html',
    styleUrls: ['./opponent-waiting-room.component.scss'],
})
export class OpponentWaitingRoomComponent implements OnInit {
    isValidSelection = false;
    gamesList: string[][] = [[]];

    constructor(private socketInformation: SocketService) {}

    ngOnInit(): void {
        this.fillGamesList();
    }

    fillGamesList() {
        const TIME_FOR_DATA_SHARING = 500;
        setTimeout(() => this.fillList(), TIME_FOR_DATA_SHARING);
    }

    fillList() {
        for (let i = 0; i < this.socketInformation.gameLists.length; i++) {
            this.gamesList[i][0] = this.socketInformation.gameLists[i][0]; // name
            this.gamesList[i][1] = this.socketInformation.gameLists[i][1]; // bonus
            this.gamesList[i][2] = this.socketInformation.gameLists[i][2]; // time per turn
        }
    }

    getBonusInLetters(bonus: string) {
        if (bonus === 'true') {
            return 'Oui';
        }
        return 'Non';
    }

    getTimePerTurn(time: string) {
        return parseInt(time, 10);
    }

    changeValidity() {
        if (!this.isValidSelection) {
            this.isValidSelection = true;
        } else {
            this.isValidSelection = false;
        }
    }

    refresh() {
        this.socketInformation.sendGameListNeededNotification();
        this.fillGamesList();
    }
}
