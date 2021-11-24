import { Component, HostListener, OnInit } from '@angular/core';
import { TileMap } from '@app/classes/grid-special-tile';
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

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler() {
        this.socketInformation.handleDisconnect();
    }
    @HostListener('contextmenu', ['$event'])
    onRightClick(event: { preventDefault: () => void }) {
        event.preventDefault();
    }

    ngOnInit(): void {
        this.fillGamesList();
    }
    setIndex(index: number) {
        this.indexWaitingRoomService.setIndex(index);
        // synch letters once and for all for joiner
        this.letterService.synchInformation(
            this.socketInformation.gameLists[index][3],
            this.socketInformation.gameLists[index][4],
            this.socketInformation.gameLists[index][5],
            this.socketInformation.gameLists[index][6],
        );
        const doubleWord = this.socketInformation.boards[index][0];
        TileMap.gridMap.tileMap.set('DoubleWord', doubleWord);
        const doubleLetter = this.socketInformation.boards[index][1];
        TileMap.gridMap.tileMap.set('DoubleLetter', doubleLetter);
        const tripleWord = this.socketInformation.boards[index][2];
        TileMap.gridMap.tileMap.set('TripleWord', tripleWord);
        const tripleLetter = this.socketInformation.boards[index][3];
        TileMap.gridMap.tileMap.set('TripleLetter', tripleLetter);
    }

    fillGamesList() {
        const TIME_FOR_DATA_SHARING = 500;
        setTimeout(() => this.fillList(), TIME_FOR_DATA_SHARING);
    }

    fillList() {
        this.gamesList.length = 0; // TODO talk to Artour
        for (let i = 0; i < this.socketInformation.gameLists.length; i++) {
            this.gamesList.push(['name', 'bonus', 'time', 'letters']);
            this.gamesList[i][0] = this.socketInformation.gameLists[i][0]; // name
            this.gamesList[i][1] = this.socketInformation.gameLists[i][1]; // bonus
            this.gamesList[i][2] = this.socketInformation.gameLists[i][2]; // time per turn
            this.gamesList[i][3] = this.socketInformation.gameLists[i][7]; // is2990
        }
    }

    getBonusInLetters(bonus: string): string {
        return bonus === 'true' ? 'Oui' : 'Non';
    }

    getTimePerTurn(time: string) {
        return parseInt(time, 10);
    }
    changeStringToBool2990(actuallyBoolean: string) {
        return actuallyBoolean === 'true';
    }

    getIs2990() {
        return this.socketInformation.is2990;
    }

    changeValidity(name: string) {
        this.isValidSelection = this.isValidSelection ? false : true;
        this.socketInformation.nameOfRoomCreator = name;
    }

    joinRandom() {
        const gameIndex = [];
        for (let i = 0; i < this.socketInformation.gameLists.length; ++i) {
            if (this.socketInformation.gameLists[i][7] === this.socketInformation.is2990.toString()) {
                gameIndex.push(i);
            }
        }
        const index = Math.floor(Math.random() * gameIndex.length);
        this.setIndex(gameIndex[index]);
    }

    refresh() {
        this.socketInformation.sendGameListNeededNotification();
        this.fillGamesList();
    }
}
