import { fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { MAXLETTERINHAND, NUMBEROFCASE } from '@app/constants';
import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { LetterBankService } from './letter-bank.service';
import { LetterService } from './letter.service';
import { PlaceLetterClickService } from './place-letter-click.service';
import { PlaceLettersService } from './place-letters.service';
import { SocketService } from './socket.service';
import { TimerTurnManagerService } from './timer-turn-manager.service';
import { WordValidationService } from './word-validation.service';
describe('PlaceLettersService', () => {
    let service: PlaceLettersService;
    let gameStateServiceSpy: jasmine.SpyObj<GameStateService>;
    let gridServiceSpy: jasmine.SpyObj<GridService>;
    let letterServiceSpy: jasmine.SpyObj<LetterService>;
    let letterBankServiceSpy: jasmine.SpyObj<LetterBankService>;
    let timeManagerSpy: jasmine.SpyObj<TimerTurnManagerService>;
    let placeLetterClickServiceSpy: jasmine.SpyObj<PlaceLetterClickService>;
    let socketSpy: jasmine.SpyObj<SocketService>;
    let wordValidationServiceSpy: jasmine.SpyObj<WordValidationService>;
    beforeEach(
        waitForAsync(() => {
            wordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', ['isWordValid']);
            gameStateServiceSpy = jasmine.createSpyObj('GameStateService', [
                'placeLetter',
                'validateWordCreatedByNewLetters',
                'removeLetter',
                'isWordCreationPossibleWithRessources',
                'isWordTouchingLetterOnBoard',
                'isLetterOnh8',
            ]);
            gameStateServiceSpy.lastLettersAdded = 'a';
            gameStateServiceSpy.lastLettersAddedJoker = 'a';
            gameStateServiceSpy.lettersOnBoard = [];
            for (let i = 0; i <= NUMBEROFCASE - 1; i++) {
                gameStateServiceSpy.lettersOnBoard.push([]);
                for (let j = 0; j <= NUMBEROFCASE - 1; j++) {
                    gameStateServiceSpy.lettersOnBoard[i].push('a');
                }
            }
            gridServiceSpy = jasmine.createSpyObj('GridService', ['drawGrid', 'drawLetterwithpositionstring', 'drawtilebackground']);
            letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset']);
            letterBankServiceSpy = jasmine.createSpyObj('LetterBankService', ['getLettersInBank']);
            letterBankServiceSpy.letterBank = [];
            letterBankServiceSpy.letterBank.push({ letter: 'a', quantity: 1, point: 1 });
            timeManagerSpy = jasmine.createSpyObj('TimerTurnManagerService', ['endTurn']);
            placeLetterClickServiceSpy = jasmine.createSpyObj('PlaceLetterClickService', ['placeLetter', 'transformIntoCommand']);
            socketSpy = jasmine.createSpyObj('SocketService', ['getMessageObservable', 'configureSendMessageToServer', 'sendLetterReplaced']);
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
            TestBed.configureTestingModule({
                providers: [
                    { provide: WordValidationService, useValue: wordValidationServiceSpy },
                    { provide: GameStateService, useValue: gameStateServiceSpy },
                    { provide: LetterService, useValue: letterServiceSpy },
                    { provide: PlaceLetterClickService, useValue: placeLetterClickServiceSpy },
                    { provide: LetterBankService, useValue: letterBankServiceSpy },
                    { provide: TimerTurnManagerService, useValue: timeManagerSpy },
                    { provide: SocketService, useValue: socketSpy },
                    { provide: GridService, useValue: gridServiceSpy },
                ],
            }).compileComponents();
        }),
    );
    beforeEach(() => {
        service = TestBed.inject(PlaceLettersService);
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
    it('placeWordGameState with h orientation should call placeletter', () => {
        service.orientation = 'h';
        service.wordToPlace = 'allo';
        service.lettersToPlace = 'allo';
        service.placeWordGameState();
        expect(gameStateServiceSpy.placeLetter).toHaveBeenCalled();
    });
    it('drawword with h orientation should call placeletter', () => {
        service.orientation = 'h';
        service.wordToPlace = 'allo';
        service.drawWord();
        expect(gridServiceSpy.drawLetterwithpositionstring).toHaveBeenCalled();
    });
    it('drawword with v orientation should call placeletter', () => {
        service.orientation = 'v';
        service.wordToPlace = 'allo';
        service.drawWord();
        expect(gridServiceSpy.drawLetterwithpositionstring).toHaveBeenCalled();
    });
    it('validateWordPlaced should return false when validateWordCreatedByNewLetters is false', fakeAsync(async () => {
        gameStateServiceSpy.indexLastLetters = [1, 2, 3];
        const dumbUndefinedVariable = undefined;
        const res = await service.validateWordPlaced(dumbUndefinedVariable);
        expect(res).toBe(await Promise.resolve(false));
        flush();
        expect(gameStateServiceSpy.validateWordCreatedByNewLetters).toHaveBeenCalled();
        expect(gridServiceSpy.drawtilebackground).toHaveBeenCalled();
        gameStateServiceSpy.indexLastLetters = [];
    }));
    it('validateWordPlaced should return true when playerUsedAllLetters is true and validateWordCreatedByNewLetters is true ', fakeAsync(() => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        letterServiceSpy.players[0].lettersReplaced = 'a';
        gameStateServiceSpy.validateWordCreatedByNewLetters.and.returnValue(promise1);
        gameStateServiceSpy.indexLastLetters = [1, 2, 3];
        gameStateServiceSpy.playerUsedAllLetters = true;
        const dumbUndefinedVariable = undefined;
        socketSpy.sendLetterReplaced.and.returnValue();
        service.validateWordPlaced(dumbUndefinedVariable).then((res: boolean) => {
            expect(res).toBe(true);
            expect(gameStateServiceSpy.validateWordCreatedByNewLetters).toHaveBeenCalled();
            expect(socketSpy.sendLetterReplaced).toHaveBeenCalled();
        });
        flush();

        gameStateServiceSpy.indexLastLetters = [];
    }));
    it('validateWordPlaced should return true when validateWordCreatedByNewLetters is true and letters replaced is defined', fakeAsync(() => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        gameStateServiceSpy.validateWordCreatedByNewLetters.and.returnValue(promise1);
        gameStateServiceSpy.indexLastLetters = [1, 2, 3];
        gameStateServiceSpy.playerUsedAllLetters = false;
        const lettersToReplace = 'allo';
        service.validateWordPlaced(lettersToReplace).then((res: boolean) => {
            expect(res).toBe(true);
            expect(gameStateServiceSpy.validateWordCreatedByNewLetters).toHaveBeenCalled();
        });
        flush();
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
        spyOn(service, 'checkInput').and.returnValue('ok');
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = true;
        gameStateServiceSpy.isLetterOnh8.and.returnValue(false);
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        service.placeWord('a1v allo').then((res: string) => {
            expect(res).toEqual('Le premier mot doit toucher à la case h8.');
            expect(gameStateServiceSpy.isWordCreationPossibleWithRessources).toHaveBeenCalled();
        });
    });
    it('placeword should return Mot placé avec succès. when the word can be placed', () => {
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        spyOn(service, 'checkInput').and.returnValue('ok');
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        spyOn(service, 'handleObjective');
        spyOn(service, 'sendWordToServer');
        gameStateServiceSpy.lastLettersAdded = 'a';
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        const mySpy2 = spyOn(service, 'drawWord');
        const mySpy3 = spyOn(service, 'validateWordPlaced').and.returnValue(promise1);
        service.placeWord('h8v allo').then((res: string) => {
            expect(res).toEqual('Mot placé avec succès.');
            expect(gameStateServiceSpy.isWordCreationPossibleWithRessources).toHaveBeenCalled();
            expect(mySpy2).toHaveBeenCalled();
            expect(mySpy3).toHaveBeenCalled();
        });
    });
    it("placeword should return 'Un mot placé n'est pas valide' when the word can be placed but doesn't exist in the dictionnary", () => {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        spyOn(service, 'checkInput').and.returnValue('ok');
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        gameStateServiceSpy.lastLettersAdded = 'a';
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        const mySpy2 = spyOn(service, 'drawWord');
        const mySpy3 = spyOn(service, 'validateWordPlaced').and.returnValue(promise1);
        service.placeWord('h8v allo').then((res: string) => {
            expect(res).toEqual("Un mot placé n'est pas valide");
            expect(gameStateServiceSpy.isWordCreationPossibleWithRessources).toHaveBeenCalled();
            expect(mySpy2).toHaveBeenCalled();
            expect(mySpy3).toHaveBeenCalled();
        });
    });
    it("placeword should return 'Vous n'avez pas les lettres pour écrire ce mot' when the player doesn't have the letter in the word", () => {
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(false);
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        service.placeWord('h8v allo').then((res: string) => {
            expect(res).toEqual("Vous n'avez pas les lettres pour écrire ce mot");
            expect(gameStateServiceSpy.isWordCreationPossibleWithRessources).toHaveBeenCalled();
            expect(mySpy2).toHaveBeenCalled();
        });
    });
    // policeSizeChanged
    it('policeSizeChanged should work when there is atleast one letter', () => {
        gameStateServiceSpy.lettersOnBoard = [[]];
        for (let i = 0; i <= NUMBEROFCASE - 1; i++) {
            gameStateServiceSpy.lettersOnBoard.push([]);
            for (let j = 0; j <= NUMBEROFCASE - 1; j++) {
                gameStateServiceSpy.lettersOnBoard[i].push('a');
            }
        }
        service.policeSizeChanged();
        expect(gridServiceSpy.drawLetterwithpositionstring).toHaveBeenCalled();
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
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        const mySpy = spyOn(service, 'placeWordGameState');
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = '';
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        const expectedResult = 'Vous devez utiliser au moins une lettre de votre main pour créer un mot';
        service.placeWord('!placer h8h allo').then((res) => {
            expect(res).toEqual(expectedResult);
            expect(mySpy).toHaveBeenCalled();
            expect(mySpy2).toHaveBeenCalled();
        });
    });
    it('placeWord should not call configureSendMessageToServer if lettersto replace is not undefined', () => {
        service.wordToPlace = 'Allo';
        service.orientation = 'h';
        service.row = 7;
        service.colomnNumber = 7;
        spyOn(service, 'checkInput').and.returnValue('ok');
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        const mySpy = spyOn(service, 'placeWordGameState');
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'Allo';
        const mySpy3 = spyOn(service, 'drawWord');
        // eslint-disable-next-line @typescript-eslint/no-shadow
        const promise1 = new Promise<boolean>((resolve) => {
            resolve(true);
        });
        spyOn(service, 'validateWordPlaced').and.returnValue(promise1);
        service.placeWord('!placer h8h Allo', 'abcd').then(() => {
            expect(mySpy).toHaveBeenCalled();
            expect(mySpy3).toHaveBeenCalled();
            expect(socketSpy.configureSendMessageToServer).not.toHaveBeenCalled();
        });
    });
    it('submitWordMadeClick should call transformIntoCommand', () => {
        service.submitWordMadeClick();
        expect(placeLetterClickServiceSpy.transformIntoCommand).toHaveBeenCalled();
    });
});
