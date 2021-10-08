import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class InitiateGameTypeService {
    // attribut representing the mode of the game
    gameType: string;
    // attribut true if player create new game, false if joining
    isMultiNewGame: boolean;
    setGameType(gameType: string, isMultiNewGame: boolean) {
        this.gameType = gameType;
        this.isMultiNewGame = isMultiNewGame;
    }
}
