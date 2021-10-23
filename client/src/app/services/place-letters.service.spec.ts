import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { LetterBankService } from './letter-bank.service';
import { LetterService } from './letter.service';
import { PlaceLettersService } from './place-letters.service';
import { MAXLETTERINHAND } from '@app/constants';
import { TimerTurnManagerService } from './timer-turn-manager.service';
describe('PlaceLettersService', () => {
    let service: PlaceLettersService;
    let gameStateServiceSpy: GameStateService;
    let gridServiceSpy: GridService;
    let letterServiceSpy: LetterService;
    let letterBankServiceSpy: LetterBankService;
    let timeManagerSpy: TimerTurnManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlaceLettersService);
        gameStateServiceSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
        gridServiceSpy = TestBed.inject(GridService) as jasmine.SpyObj<GridService>;
        letterServiceSpy = TestBed.inject(LetterService) as jasmine.SpyObj<LetterService>;
        letterBankServiceSpy = TestBed.inject(LetterBankService) as jasmine.SpyObj<LetterBankService>;
        timeManagerSpy = TestBed.inject(TimerTurnManagerService) as jasmine.SpyObj<TimerTurnManagerService>;
        timeManagerSpy.turn = 0;
        const player1 = new PlayerLetterHand(letterBankServiceSpy);
        for (let i = 0; i < MAXLETTERINHAND; i++) {
            player1.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
        }
        const player2 = new PlayerLetterHand(letterBankServiceSpy);
        for (let i = 0; i < MAXLETTERINHAND; i++) {
            player2.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
        }
        letterServiceSpy.players = [player1, player2];
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('verifyTileNotOutOfBound should return false when orientation h and colomn 15', () => {
        service.wordToPlace = 'testing';
        service.colomnNumber = 15;
        service.row = 1;
        service.orientation = 'h';
        const returnmessage = service.verifyTileNotOutOfBound();
        expect(returnmessage).toEqual(false);
    });
    it('verifyTileNotOutOfBound should return false when orientation v and row 15', () => {
        service.wordToPlace = 'testing';
        service.colomnNumber = 1;
        service.row = 15;
        service.orientation = 'v';
        const returnmessage = service.verifyTileNotOutOfBound();
        expect(returnmessage).toEqual(false);
    });

    it('verifyTileNotOutOfBound should return true for a valid word', () => {
        service.wordToPlace = 'testing';
        service.colomnNumber = 8;
        service.row = 8;
        service.orientation = 'v';
        const returnmessage = service.verifyTileNotOutOfBound();
        expect(returnmessage).toEqual(true);
    });
    // placeWordGameState
    it('placeWordGameState with h orientation should call placeletter', () => {
        service.orientation = 'h';
        service.wordToPlace = 'allo';
        service.lettersToPlace = 'allo';
        const mySpy = spyOn(gameStateServiceSpy, 'placeLetter');
        service.placeWordGameState();
        expect(mySpy).toHaveBeenCalled();
    });

    // drawword
    it('drawword with h orientation should call placeletter', () => {
        service.orientation = 'h';
        service.wordToPlace = 'allo';
        const mySpy = spyOn(gridServiceSpy, 'drawLetterwithpositionstring');
        service.drawWord();
        expect(mySpy).toHaveBeenCalled();
    });

    it('drawword with v orientation should call placeletter', () => {
        service.orientation = 'v';
        service.wordToPlace = 'allo';
        const mySpy = spyOn(gridServiceSpy, 'drawLetterwithpositionstring');
        service.drawWord();
        expect(mySpy).toHaveBeenCalled();
    });

    // validateWordPlaced
    it('validateWordPlaced should return false when validateWordCreatedByNewLetters is false', fakeAsync(() => {
        const mySpy = spyOn(gameStateServiceSpy, 'validateWordCreatedByNewLetters').and.returnValue(false);
        const mySpy2 = spyOn(gridServiceSpy, 'drawtilebackground');
        gameStateServiceSpy.indexLastLetters = [1, 2, 3];
        const returnvalue = service.validateWordPlaced();
        flush();
        expect(returnvalue).toBe(false);
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        gameStateServiceSpy.indexLastLetters = [];
    }));
    it('validateWordPlaced should return true when playerUsedAllLetters is true and validateWordCreatedByNewLetters is false ', fakeAsync(() => {
        const mySpy = spyOn(gameStateServiceSpy, 'validateWordCreatedByNewLetters').and.returnValue(true);
        gameStateServiceSpy.indexLastLetters = [1, 2, 3];
        gameStateServiceSpy.playerUsedAllLetters = true;
        const returnvalue = service.validateWordPlaced();
        flush();
        expect(returnvalue).toBe(true);
        expect(mySpy).toHaveBeenCalled();
        gameStateServiceSpy.indexLastLetters = [];
    }));
    // verifyavailable tests
    it('verifyAvailable should be called when the word is not out of bound', () => {
        service.orientation = 'h';
        const mySpy = spyOn(service, 'verifyAvailable');
        service.placeWord('a1v allo');
        expect(mySpy).toHaveBeenCalled();
    });
    // verifyCaseAvailable
    it('verifyAvailable should return false when the tile is not empty', () => {
        gameStateServiceSpy.lettersOnBoard[0][0] = 'a';
        const returnvalue = service.verifyCaseAvailable(0, 0, 'z');
        expect(returnvalue).toBe(false);
    });
    // placeword function tests
    it("placeword should return 'Le mot dépasse du plateau de jeux.' for a word that goes beyond the board", () => {
        const returnmessage = service.placeWord('o15v allo');
        expect(returnmessage).toEqual('Le mot dépasse du plateau de jeux.');
    });
    it("placeword should return 'Argument de commande invalide' for an invalid command", () => {
        const returnmessage = service.placeWord('z16Z allo');
        expect(returnmessage).toEqual('Argument de commande invalide');
    });

    it("placeword should return 'Au moins une des cases est déjà occupée.' when a tile of the word is already used", () => {
        const mySpy = spyOn(service, 'verifyCaseAvailable').and.returnValue(false);
        service.placeWord('a1v allo');
        expect(mySpy).toHaveBeenCalled();
    });
    it("placeword should return 'Le premier mot doit toucher à la case h8' when the first word isn't placed on h8 tile", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        const returnmessage = service.placeWord('a1v allo');
        expect(mySpy).toHaveBeenCalled();
        expect(returnmessage).toEqual('Le premier mot doit toucher à la case h8.');
    });
    it("placeword should return 'Ce mot ne touche à aucune lettre déjà en jeu.' when the word doesn't touch a tile", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'allo';
        service.wordToPlace = 'bonjour';
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        const returnmessage = service.placeWord('a1v allo');
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(returnmessage).toEqual('Ce mot ne touche à aucune lettre déjà en jeu.');
    });

    it("placeword should return 'Mot placé avec succès.' when the word can be placed", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        const mySpy2 = spyOn(service, 'drawWord');
        const returnmessage = service.placeWord('h8v allo');
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(returnmessage).toEqual('Mot placé avec succès.');
    });

    it("placeword should return 'Un mot placé n'est pas valide' when the word can be placed but doesn't exist in the dictionnary", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        const mySpy2 = spyOn(service, 'drawWord');
        const mySpy3 = spyOn(service, 'validateWordPlaced').and.returnValue(false);
        const returnmessage = service.placeWord('h8v allo');
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
        expect(returnmessage).toEqual("Un mot placé n'est pas valide");
    });
    it("placeword should return 'Vous n'avez pas les lettres pour écrire ce mot' when the player doesn't have the letter in the word", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(false);
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        const returnmessage = service.placeWord('h8v allo');
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(returnmessage).toEqual("Vous n'avez pas les lettres pour écrire ce mot");
    });

    // policeSizeChanged
    it('policeSizeChanged should work when there is atleast one letter', () => {
        const mySpy = spyOn(gridServiceSpy, 'drawLetterwithpositionstring');
        gameStateServiceSpy.lettersOnBoard[0][0] = 'a';
        service.policeSizeChanged();
        expect(mySpy).toHaveBeenCalled();
    });

    // wordContainsJoker
    it('wordContainsJoker should call removeUpperCaseFromString when there is atleast one uppercase letter', () => {
        const mySpy = spyOn(service, 'removeUpperCaseFromString');
        service.wordToPlace = 'Allo';
        service.wordContainsJoker();
        expect(mySpy).toHaveBeenCalled();
    });

    // removeUpperCaseFromString
    it('removeUpperCaseFromString should remove uppercase and replace them with * ', () => {
        service.wordToPlace = 'Allo';
        service.removeUpperCaseFromString(0);
    });
});
