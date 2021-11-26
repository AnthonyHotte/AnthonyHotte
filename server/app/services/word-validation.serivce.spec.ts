import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';
import { DictionaryService } from './dictionary.service';

describe('Word validation service', () => {
    let wordValidationService: WordValidationService;
    let dico: DictionaryService;

    before(() => {
        dico = new DictionaryService();
        wordValidationService = new WordValidationService(dico);
    });

    it('isWordValid should return true with aa', () => {
        const isValid = wordValidationService.isWordValid('aa');
        expect(isValid).equal(true);
    });
    it('isWordLongerThanTwo should return false with a', () => {
        const isValid = wordValidationService.isWordLongerThanTwo('a');
        expect(isValid).equal(false);
    });
    it('isWordValid should return false with a', () => {
        const isValid = wordValidationService.isWordValid('a');
        expect(isValid).equal(false);
    });
    it('isWordValid should return false with abbbb', () => {
        const isValid = wordValidationService.isWordValid('abbbb');
        expect(isValid).equal(false);
    });
});
