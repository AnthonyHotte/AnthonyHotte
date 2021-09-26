import { TestBed, waitForAsync } from '@angular/core/testing';

import { GameStateService } from '@app/services/game-state.service';
import { WordValidationService } from '@app/services/word-validation.service';

describe('GameStateService', () => {
    let service: GameStateService;
    let wordValidationServiceSpy: jasmine.SpyObj<WordValidationService>;
    beforeEach(
        waitForAsync(() => {
            wordValidationServiceSpy = jasmine.createSpyObj('WordValidationService', ['validateHorizontalWord']);
            wordValidationServiceSpy.validateHorizontalWord.and.returnValue(true);
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
        service.indexLastLetters = [];
        service.lettersOnBoard[0][0] = '';
        service.placeLetter(0, 0, 'a');
        expect(service.lettersOnBoard[0][0]).toMatch('a');
    });
});
