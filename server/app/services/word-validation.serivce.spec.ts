import { Dictionary } from '@app/classes/dictionary';
import { WordValidationService } from '@app/services/word-validation.service';
import { expect } from 'chai';
import { createStubInstance } from 'sinon';
import { DictionaryService } from './dictionary.service';

describe('Word validation service', () => {
    let wordValidationService: WordValidationService;
    let dico: DictionaryService;
    before(() => {
        dico = createStubInstance(DictionaryService);
        dico.indexDictionaryInUse = 0;
        dico.dictionaryList = [];
        dico.dictionaryList.push(new Dictionary('t1', 'd1'));
        dico.dictionaryList[0].words = ['aa'];
        wordValidationService = new WordValidationService(dico);
    });

    // it('should do something', async () => {
    //     expect(wordValidationService.dicLength).to.be.greaterThan(1);
    // });
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
