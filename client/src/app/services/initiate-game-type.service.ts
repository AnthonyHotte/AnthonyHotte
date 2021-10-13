import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
// this class is usefull to pass information between game-selection-page and solo-game-inititiator
export class InitiateGameTypeService {
    // attribut representing the mode of the game can be either solo or multi player
    gameType: string;
    // attribut true if player create new game, false if joining
    isNewGame: boolean;
    setGameType(gameType: string, isNewGame: boolean) {
        this.gameType = gameType;
        this.isNewGame = isNewGame;
    }
}
