import { fakeAsync, flush, TestBed } from '@angular/core/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND } from '@app/constants';
import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { LetterBankService } from './letter-bank.service';
import { LetterService } from './letter.service';
import { PlaceLetterClickService } from './place-letter-click.service';
import { PlaceLettersService } from './place-letters.service';
import { SocketService } from './socket.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
describe('PlaceLettersService', () => {
    let service: PlaceLettersService;
    let gameStateServiceSpy: GameStateService;
    let gridServiceSpy: GridService;
    let letterServiceSpy: LetterService;
    let letterBankServiceSpy: LetterBankService;
    let timeManagerSpy: TimerTurnManagerService;
    let placeLetterClickServiceSpy: PlaceLetterClickService;
    let socketSpy: SocketService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(PlaceLettersService);
        gameStateServiceSpy = TestBed.inject(GameStateService) as jasmine.SpyObj<GameStateService>;
        gridServiceSpy = TestBed.inject(GridService) as jasmine.SpyObj<GridService>;
        letterServiceSpy = TestBed.inject(LetterService) as jasmine.SpyObj<LetterService>;
        letterBankServiceSpy = TestBed.inject(LetterBankService) as jasmine.SpyObj<LetterBankService>;
        timeManagerSpy = TestBed.inject(TimerTurnManagerService) as jasmine.SpyObj<TimerTurnManagerService>;
        placeLetterClickServiceSpy = TestBed.inject(PlaceLetterClickService) as jasmine.SpyObj<PlaceLetterClickService>;
        socketSpy = TestBed.inject(SocketService) as jasmine.SpyObj<SocketService>;
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
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        const mySpy = spyOn(gameStateServiceSpy, 'validateWordCreatedByNewLetters').and.returnValue(promise1);
        const mySpy2 = spyOn(gridServiceSpy, 'drawtilebackground');
        gameStateServiceSpy.indexLastLetters = [1, 2, 3];
        const dumbUndefinedVariable = undefined;
        service.validateWordPlaced(dumbUndefinedVariable).then((res: boolean) => {
            expect(res).toBe(false);
        });
        flush();
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        gameStateServiceSpy.indexLastLetters = [];
    }));
    it('validateWordPlaced should return true when playerUsedAllLetters is true and validateWordCreatedByNewLetters is true ', fakeAsync(() => {
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        const mySpy = spyOn(gameStateServiceSpy, 'validateWordCreatedByNewLetters').and.returnValue(promise1);
        gameStateServiceSpy.indexLastLetters = [1, 2, 3];
        gameStateServiceSpy.playerUsedAllLetters = true;
        const dumbUndefinedVariable = undefined;
        service.validateWordPlaced(dumbUndefinedVariable).then((res: boolean) => {
            expect(res).toBe(true);
        });
        flush();
        expect(mySpy).toHaveBeenCalled();
        gameStateServiceSpy.indexLastLetters = [];
    }));

    it('validateWordPlaced should return true ehen validateWordCreatedByNewLetters is true and letters replaced is defined', fakeAsync(() => {
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        const mySpy = spyOn(gameStateServiceSpy, 'validateWordCreatedByNewLetters').and.returnValue(promise1);
        gameStateServiceSpy.indexLastLetters = [1, 2, 3];
        gameStateServiceSpy.playerUsedAllLetters = false;
        const lettersToReplace = 'allo';
        service.validateWordPlaced(lettersToReplace).then((res: boolean) => {
            expect(res).toBe(true);
        });
        flush();
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

    it('verifyCaseAvailable should be called when verifyAvailable is called', () => {
        service.orientation = 'h';
        service.wordToPlace = 'testing';
        service.colomnNumber = 8;
        service.row = 8;
        const mySpy = spyOn(service, 'verifyCaseAvailable').and.returnValue(true);
        service.verifyAvailable();
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
        service.placeWord('o15v allo').then((res: string) => {
            expect(res).toEqual('Le mot dépasse du plateau de jeux.');
        });
    });
    it("placeword should return 'Argument de commande invalide' for an invalid command", () => {
        service.placeWord('z16Z allo').then((res: string) => {
            expect(res).toEqual('Argument de commande invalide');
        });
    });

    it("placeword should return 'Au moins une des cases est déjà occupée.' when a tile of the word is already used", () => {
        const mySpy = spyOn(service, 'verifyCaseAvailable').and.returnValue(false);
        service.placeWord('a1v allo');
        expect(mySpy).toHaveBeenCalled();
    });
    it("placeword should return 'Le premier mot doit toucher à la case h8' when the first word isn't placed on h8 tile", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        service.placeWord('a1v allo').then((res: string) => {
            expect(res).toEqual('Le premier mot doit toucher à la case h8.');
        });
        expect(mySpy).toHaveBeenCalled();
    });
    it("placeword should return 'Ce mot ne touche à aucune lettre déjà en jeu.' when the word doesn't touch a tile", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'allo';
        service.wordToPlace = 'bonjour';
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        service.placeWord('a1v allo').then((res: string) => {
            expect(res).toEqual('Ce mot ne touche à aucune lettre déjà en jeu.');
        });
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });

    it("placeword should return 'Mot placé avec succès.' when the word can be placed", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        const mySpy2 = spyOn(service, 'drawWord');
        service.placeWord('h8v allo').then((res: string) => {
            expect(res).toEqual('Mot placé avec succès.');
        });
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });

    it("placeword should return 'Un mot placé n'est pas valide' when the word can be placed but doesn't exist in the dictionnary", () => {
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        const mySpy2 = spyOn(service, 'drawWord');
        const mySpy3 = spyOn(service, 'validateWordPlaced').and.returnValue(promise1);
        service.placeWord('h8v allo').then((res: string) => {
            expect(res).toEqual("Un mot placé n'est pas valide");
        });
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
    });
    it("placeword should return 'Vous n'avez pas les lettres pour écrire ce mot' when the player doesn't have the letter in the word", () => {
        const mySpy = spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(false);
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        service.placeWord('h8v allo').then((res: string) => {
            return res;
        });
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
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

    it('placeWord should return Vous devez utiliser au moins une lettre de votre main pour créer if last letters added is empty', () => {
        service.wordToPlace = 'Allo';
        service.orientation = 'h';
        service.row = 7;
        service.colomnNumber = 7;
        spyOn(service, 'checkInput').and.returnValue('ok');
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        const mySpy = spyOn(service, 'placeWordGameState');
        spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = '';
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        const expectedResult = 'Vous devez utiliser au moins une lettre de votre main pour créer un mot';
        service.placeWord('!placer h8h allo').then((res: string) => {
            expect(res).toEqual(expectedResult);
        });
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });

    it('placeWord should not call configureSendMessageToServer if lettersto replace is not undefined', () => {
        service.wordToPlace = 'Allo';
        service.orientation = 'h';
        service.row = 7;
        service.colomnNumber = 7;
        spyOn(service, 'checkInput').and.returnValue('ok');
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        spyOn(gameStateServiceSpy, 'isWordTouchingLetterOnBoard').and.returnValue(true);
        const mySpy = spyOn(service, 'placeWordGameState');
        spyOn(gameStateServiceSpy, 'isWordCreationPossibleWithRessources').and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'Allo';
        const mySpy3 = spyOn(service, 'drawWord');
        const mySpy4 = spyOn(socketSpy, 'configureSendMessageToServer');
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        spyOn(service, 'validateWordPlaced').and.returnValue(promise1);
        service.placeWord('!placer h8h Allo', 'abcd');
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
        expect(mySpy4).not.toHaveBeenCalled();
    });
    it('submitWordMadeClick should call transformIntoCommand', () => {
        const mySpy = spyOn(placeLetterClickServiceSpy, 'transformIntoCommand');
        service.submitWordMadeClick();
        expect(mySpy).toHaveBeenCalled();
    });
});
