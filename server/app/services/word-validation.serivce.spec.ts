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
});
