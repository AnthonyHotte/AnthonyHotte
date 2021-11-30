/* eslint-disable max-lines */
import { fakeAsync, flush, TestBed, waitForAsync } from '@angular/core/testing';
import { PlayerLetterHand } from '@app/classes/player-letter-hand';
import { FIFTEEN, MAXLETTERINHAND, NUMBEROFCASE, TWELVE, TWENTY } from '@app/constants';
import { GameStateService } from '@app/services/game-state.service';
import { GridService } from '@app/services/grid.service';
import { LetterBankService } from './letter-bank.service';
import { LetterService } from './letter.service';
import { ObjectivesService } from './objectives.service';
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
    let objectivesServiceSpy: jasmine.SpyObj<ObjectivesService>;
    beforeEach(
        waitForAsync(() => {
            objectivesServiceSpy = jasmine.createSpyObj('ObjectivesService', ['diffLetters0', 'wordsNoBonus1', 'noConsonant2', 'consecutivePlace3']);
            objectivesServiceSpy.objectiveVerif = new Map<number, () => boolean>();
            objectivesServiceSpy.diffLetters0.and.returnValue(true);
            objectivesServiceSpy.wordsNoBonus1.and.returnValue(true);
            objectivesServiceSpy.noConsonant2.and.returnValue(true);
            objectivesServiceSpy.consecutivePlace3.and.returnValue(true);
            objectivesServiceSpy.objectivePoint = new Map<number, number>();
            objectivesServiceSpy.objectivePoint.set(0, TWENTY);
            objectivesServiceSpy.objectivePoint.set(1, FIFTEEN);
            objectivesServiceSpy.objectivePoint.set(2, TWELVE);
            objectivesServiceSpy.objectivePoint.set(3, TWELVE);
            objectivesServiceSpy.objectiveVerif.set(0, objectivesServiceSpy.diffLetters0);
            objectivesServiceSpy.objectiveVerif.set(1, objectivesServiceSpy.wordsNoBonus1);
            objectivesServiceSpy.objectiveVerif.set(2, objectivesServiceSpy.noConsonant2);
            objectivesServiceSpy.objectiveVerif.set(3, objectivesServiceSpy.consecutivePlace3);
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
            letterServiceSpy.objCompletor = [];
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
            player1.objectives = [0, 1, 2];
            const player2 = new PlayerLetterHand(letterBankServiceSpy);
            for (let i = 0; i < MAXLETTERINHAND; i++) {
                player2.allLettersInHand.push({ letter: 'a', quantity: 1, point: 1 });
            }
            player2.objectives = [0, 1, 3];
            letterServiceSpy.players = [player1, player2];
            TestBed.configureTestingModule({
                providers: [
                    { provide: ObjectivesService, useValue: objectivesServiceSpy },
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
        service.validateWordPlaced(dumbUndefinedVariable).then((res) => {
            expect(res).toBe(false);
        });
        flush();
        expect(gameStateServiceSpy.validateWordCreatedByNewLetters).toHaveBeenCalled();
        expect(gridServiceSpy.drawtilebackground).toHaveBeenCalled();
        gameStateServiceSpy.indexLastLetters = [];
    }));
    it('validateWordPlaced should return true when playerUsedAllLetters is true and validateWordCreatedByNewLetters is true ', fakeAsync(() => {
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
    it('verifyCaseAvailable should be called when verifyAvailable is called and orientation v', () => {
        service.orientation = 'v';
        service.wordToPlace = 'testing';
        service.colomnNumber = 8;
        service.row = 8;
        const mySpy = spyOn(service, 'verifyCaseAvailable').and.returnValue(true);
        service.verifyAvailable();
        expect(mySpy).toHaveBeenCalled();
    });
    it('verifyAvailable should return false when the tile is not empty', () => {
        gameStateServiceSpy.lettersOnBoard[0][0] = 'a';
        service.orientation = 'v';
        const returnvalue = service.verifyCaseAvailable(0, 0, 'z');
        expect(returnvalue).toBe(false);
    });
    it('verifyAvailable should return true when the tile is empty', () => {
        gameStateServiceSpy.lettersOnBoard[0][0] = '';
        service.orientation = 'v';
        const returnvalue = service.verifyCaseAvailable(0, 0, 'z');
        expect(returnvalue).toBe(true);
    });
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

    it("placeword should return 'Ce mot ne touche à aucune lettre déjà en jeu' when the first word isn't placed on h8 tile", () => {
        spyOn(service, 'checkInput').and.returnValue('ok');
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(false);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'a';
        gameStateServiceSpy.isLetterOnh8.and.returnValue(false);
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        spyOn(service, 'placeWordGameState');
        spyOn(service, 'removeLetterInGameState');
        spyOn(service, 'sendWordToServer');
        service.placeWord('a1v allo').then((res: string) => {
            expect(res).toEqual('Ce mot ne touche à aucune lettre déjà en jeu.');
            expect(gameStateServiceSpy.isWordCreationPossibleWithRessources).toHaveBeenCalled();
        });
    });
    it("placeword should return 'Un mot placé n'est pas valide' when the first word isn't placed on h8 tile", () => {
        const promise = new Promise<boolean>((resolve) => {
            resolve(false);
        });
        spyOn(service, 'checkInput').and.returnValue('ok');
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        gameStateServiceSpy.isBoardEmpty = false;
        gameStateServiceSpy.lastLettersAdded = 'a';
        gameStateServiceSpy.isLetterOnh8.and.returnValue(false);
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        spyOn(service, 'placeWordGameState');
        spyOn(service, 'removeLetterInGameState');
        spyOn(service, 'sendWordToServer');
        spyOn(service, 'drawWord');
        spyOn(service, 'validateWordPlaced').and.returnValue(promise);
        service.placeWord('a1v allo').then((res: string) => {
            expect(res).toEqual("Un mot placé n'est pas valide");
            expect(gameStateServiceSpy.isWordCreationPossibleWithRessources).toHaveBeenCalled();
        });
    });

    it("placeword should return 'Un mot placé n'est pas valide' when the word can be placed but doesn't exist in the dictionnary", () => {
        spyOn(service, 'checkInput').and.returnValue('ok');
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        gameStateServiceSpy.lastLettersAdded = 'a';
        gameStateServiceSpy.isBoardEmpty = true;
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        spyOn(service, 'placeWordGameState');
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        const mySpy3 = spyOn(service, 'sendWordToServer');
        service.placeWord('h8v allo').then((res: string) => {
            expect(res).toEqual('Le premier mot doit toucher à la case h8.');
            expect(gameStateServiceSpy.isWordCreationPossibleWithRessources).toHaveBeenCalled();
            expect(mySpy2).toHaveBeenCalled();
            expect(mySpy3).toHaveBeenCalled();
        });
    });

    it("placeword should return 'Vous devez utiliser au moins une lettre de votre main pour créer un mot'", () => {
        spyOn(service, 'checkInput').and.returnValue('ok');
        spyOn(service, 'verifyTileNotOutOfBound').and.returnValue(true);
        gameStateServiceSpy.lastLettersAdded = '';
        gameStateServiceSpy.isBoardEmpty = true;
        gameStateServiceSpy.isWordCreationPossibleWithRessources.and.returnValue(true);
        gameStateServiceSpy.isWordTouchingLetterOnBoard.and.returnValue(true);
        gameStateServiceSpy.isLetterOnh8.and.returnValue(true);
        spyOn(service, 'placeWordGameState');
        spyOn(service, 'verifyAvailable').and.returnValue(true);
        const mySpy2 = spyOn(service, 'removeLetterInGameState');
        const mySpy3 = spyOn(service, 'sendWordToServer');
        service.placeWord('h8v allo').then((res: string) => {
            expect(res).toEqual('Vous devez utiliser au moins une lettre de votre main pour créer un mot');
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
    it('policeSizeChanged should work when there is atleast one letter', () => {
        gameStateServiceSpy.lettersOnBoard = [[]];
        for (let i = 0; i <= NUMBEROFCASE - 1; i++) {
            gameStateServiceSpy.lettersOnBoard.push([]);
            for (let j = 0; j <= NUMBEROFCASE - 1; j++) {
                gameStateServiceSpy.lettersOnBoard[i].push('a');
            }
        }
        gameStateServiceSpy.lettersOnBoard[0][0] = '';
        service.policeSizeChanged();
        expect(gridServiceSpy.drawLetterwithpositionstring).toHaveBeenCalled();
    });
    it('wordContainsJoker should call removeUpperCaseFromString when there is atleast one uppercase letter', () => {
        const mySpy = spyOn(service, 'removeUpperCaseFromString');
        service.wordToPlace = 'Allo';
        service.wordContainsJoker();
        expect(mySpy).toHaveBeenCalled();
    });
    it('handleObjective should call removeUpperCaseFromString', () => {
        socketSpy.is2990 = true;
        timeManagerSpy.turn = 0;
        letterServiceSpy.objCompleted = [1];
        service.handleObjective();
        expect(objectivesServiceSpy.lastLettersAdded).toEqual(gameStateServiceSpy.lastLettersAdded);
    });
    it('handleObjective should call removeUpperCaseFromString when there is atleast one uppercase letter', () => {
        socketSpy.is2990 = true;
        timeManagerSpy.turn = 0;
        objectivesServiceSpy.wordsNoBonus1.and.returnValue(false);
        letterServiceSpy.objCompleted = [1];
        service.handleObjective();
        expect(objectivesServiceSpy.lastLettersAdded).toEqual(gameStateServiceSpy.lastLettersAdded);
    });
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
