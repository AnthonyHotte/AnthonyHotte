import { Dictionary } from '@app/classes/dictionary';
import { expect } from 'chai';
import { DictionaryService } from './dictionary.service';

describe('Dictionary service', () => {
    let dictionaryService: DictionaryService;

    beforeEach(async () => {
        dictionaryService = new DictionaryService();
        dictionaryService.dictionaryList = [];
        dictionaryService.indexDictionaryInUse = 0;
        dictionaryService.dictionaryList.push(new Dictionary('t1', 'd1'));
    });

    it('should return a list of dictionary', () => {
        const dictList = dictionaryService.getDictionaryTitleAndDescription();
        expect(dictList[0].title).to.equals('t1');
        expect(dictList[0].description).to.equals('d1');
        expect(dictList.length).to.equals(1);
    });
    it('should add a dictionary', () => {
        dictionaryService.addDictionary(new Dictionary('t2', 'd2'));
        expect(dictionaryService.dictionaryList[1].title).to.equals('t2');
        expect(dictionaryService.dictionaryList[1].description).to.equals('d2');
        expect(dictionaryService.dictionaryList.length).to.equals(2);
    });
    it('should modify a dictionary', () => {
        dictionaryService.modifyDictionary(0, new Dictionary('t3', 'd3'));
        expect(dictionaryService.dictionaryList[0].title).to.equals('t3');
        expect(dictionaryService.dictionaryList[0].description).to.equals('d3');
        expect(dictionaryService.dictionaryList.length).to.equals(1);
    });
    it('should delete a dictionary', () => {
        dictionaryService.deleteDictionary(0);
        expect(dictionaryService.dictionaryList.length).to.equals(0);
    });
    it('should reinitialize the dictionary list', () => {
        dictionaryService.addDictionary(new Dictionary('t2', 'd2'));
        dictionaryService.reinitialize();
        expect(dictionaryService.dictionaryList[0].title).to.equals('t1');
        expect(dictionaryService.dictionaryList[0].description).to.equals('d1');
        expect(dictionaryService.dictionaryList.length).to.equals(1);
    });
    it('should addFullDictionary correctly', () => {
        const dict = new Dictionary('t2', 'd2');
        dict.words = ['aa', 'bb'];
        dictionaryService.addFullDictionary(dict);
        expect(dictionaryService.dictionaryList[1].title).to.equals('t2');
        expect(dictionaryService.dictionaryList[1].description).to.equals('d2');
        expect(dictionaryService.dictionaryList[1].words.length).to.equals(2);
        expect(dictionaryService.dictionaryList.length).to.equals(2);
    });
});
