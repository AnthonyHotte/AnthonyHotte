import { Component, OnInit } from '@angular/core';
import { IndexWaitingRoomService } from '@app/services/index-waiting-room.service';
import { LetterService } from '@app/services/letter.service';
import { SocketService } from '@app/services/socket.service';

@Component({
    selector: 'app-opponent-waiting-room',
    templateUrl: './opponent-waiting-room.component.html',
    styleUrls: ['./opponent-waiting-room.component.scss'],
})
export class OpponentWaitingRoomComponent implements OnInit {
    isValidSelection = false;
    gamesList: string[][] = [[]];

    constructor(
        private socketInformation: SocketService,
        private indexWaitingRoomService: IndexWaitingRoomService,
        private letterService: LetterService,
    ) {}

    ngOnInit(): void {
        this.fillGamesList();
    }
    setIndex(index: number) {
        this.indexWaitingRoomService.index = index;
        // synch letters once and for all for joiner
        this.letterService.synchLetters(this.socketInformation.gameLists[index][3], this.socketInformation.gameLists[index][4]);
    }

    fillGamesList() {
        const TIME_FOR_DATA_SHARING = 500;
        setTimeout(() => this.fillList(), TIME_FOR_DATA_SHARING);
    }

    fillList() {
        this.gamesList.length = 0;
        for (let i = 0; i < this.socketInformation.gameLists.length; i++) {
            this.gamesList.push(['name', 'bonus', 'time', 'letters']);
            this.gamesList[i][0] = this.socketInformation.gameLists[i][0]; // name
            this.gamesList[i][1] = this.socketInformation.gameLists[i][1]; // bonus
            this.gamesList[i][2] = this.socketInformation.gameLists[i][2]; // time per turn
            this.gamesList[i][3] = this.socketInformation.gameLists[i][3] + this.socketInformation.gameLists[i][4];
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

    changeValidity(name: string) {
        if (!this.isValidSelection) {
            this.isValidSelection = true;
        } else {
            this.isValidSelection = false;
        }
        this.socketInformation.nameOfRoomCreator = name;
    }

    refresh() {
        this.socketInformation.sendGameListNeededNotification();
        this.fillGamesList();
    }
}
