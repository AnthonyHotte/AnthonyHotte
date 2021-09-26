import { TestBed, waitForAsync } from '@angular/core/testing';
import { NUMBEROFCASE } from '@app/constants';

import { GameStateService } from '@app/services/game-state.service';
import { WordValidationService } from '@app/services/word-validation.service';

describe('GameStateService', () => {
    let service: GameStateService;
    let wordValidationServiceSpy: jasmine.SpyObj<WordValidationService>;
    beforeEach(
        waitForAsync(() => {
            wordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', ['validateHorizontalWord']);
            TestBed.configureTestingModule({
                providers: [{ provide: WordValidationService, useValue: wordValidationServiceSpy }],
            }).compileComponents();
        }),
    );

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GameStateService);
        // service.lettersOnBoard
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('removeLetter should remove the letter a', () => {
        service.lettersOnBoard[0][0] = 'a';
        service.removeLetter(0, 0);
        expect(service.lettersOnBoard[0][0]).toMatch('');
    });

    it('placeLetter should place the letter a', () => {
        service.lettersOnBoard = [];
        for (let i = 0; i < NUMBEROFCASE; i++) {
            service.lettersOnBoard[i] = [];
            for (let j = 0; j < NUMBEROFCASE; j++) {
                service.lettersOnBoard[i][j] = '';
            }
        }
        // service.placeLetter(0, 0, 'a');
        // expect(service.lettersOnBoard[0][0]).toMatch('a');
        // expect(service.playerUsedAllLetters).toBe(false);
        // expect(service.lastLettersAdded.pop()).toEqual(0);
        // expect(service.lastLettersAdded.pop()).toEqual(0);
    });
});
