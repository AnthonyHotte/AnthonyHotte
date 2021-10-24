import { Component } from '@angular/core';
import { InitiateGameTypeService } from '@app/services/initiate-game-type.service';
import { SocketService } from '@app/services/socket.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent {
    // attribut representing the mode of the game
    gameType: string;
    // attribut true if player create new game, false if joining
    isNewGame: boolean;
    constructor(private initiateGameType: InitiateGameTypeService, private socket: SocketService) {
        this.gameType = 'solo';
        this.isNewGame = false;
    }

    setSoloType() {
        this.gameType = 'solo';
        this.isNewGame = true;
        this.initiateGameType.setGameType(this.gameType, this.isNewGame);
    }
    setCreateMultiPlayerGame() {
        this.gameType = 'multi player';
        this.isNewGame = true;
        this.initiateGameType.setGameType(this.gameType, this.isNewGame);
    }
    setJoinMultiPayerGame() {
        this.gameType = 'multi player';
        this.isNewGame = false;
        this.initiateGameType.setGameType(this.gameType, this.isNewGame);
        this.socket.sendGameListNeededNotification();
    }
}
