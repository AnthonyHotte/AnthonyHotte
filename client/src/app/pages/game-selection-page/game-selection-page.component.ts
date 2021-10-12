import { Component } from '@angular/core';
import { InitiateGameTypeService } from '@app/services/initiate-game-type.service';

@Component({
    selector: 'app-game-selection-page',
    templateUrl: './game-selection-page.component.html',
    styleUrls: ['./game-selection-page.component.scss'],
})
export class GameSelectionPageComponent {
    // attribut representing the mode of the game
    gameType: string;
    // attribut true if player create new game, false if joining
    isMultiNewGame: boolean;
    constructor(private initiateGameType: InitiateGameTypeService) {
        this.gameType = 'solo';
        this.isMultiNewGame = false;
    }

    setSoloType() {
        this.gameType = 'solo';
        this.isMultiNewGame = false;
        this.initiateGameType.setGameType(this.gameType, this.isMultiNewGame);
    }
    setCreateMultiPlayerGame() {
        this.gameType = 'multi player';
        this.isMultiNewGame = true;
        this.initiateGameType.setGameType(this.gameType, this.isMultiNewGame);
    }
    setJoinMultiPayerGame() {
        this.gameType = 'multi player';
        this.isMultiNewGame = false;
        this.initiateGameType.setGameType(this.gameType, this.isMultiNewGame);
    }
}
