import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';

describe('Word validation service', () => {
    let wordValidationService: WordValidationService;

    before(() => {
        wordValidationService = new WordValidationService();
    });

    it('should do something', async () => {
        expect(wordValidationService.dicLength).to.be.greaterThan(1);
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