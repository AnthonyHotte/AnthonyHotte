import { Dictionary } from '@app/classes/dictionary';
import { Service } from 'typedi';
import jsonDictionnary from '@app/dictionnary.json';

@Service()
export class DictionaryService {
    indexDictionaryInUse: number;
    dictionaryList: Dictionary[];
    constructor() {
        this.indexDictionaryInUse = 0;
        const temp = JSON.parse(JSON.stringify(jsonDictionnary));
        this.dictionaryList = [new Dictionary(temp.title, temp.description)];
        this.dictionaryList[0].content = [];
        for (const word of temp.words) {
            this.dictionaryList[0].content.push(word);
        }
        this.dictionaryList.push(new Dictionary('titre1', 'description1'));
    }
    getDictionaryTitleAndDescription(): Dictionary[] {
        const dictToSend: Dictionary[] = [];
        for (const dict of this.dictionaryList) {
            dictToSend.push(new Dictionary(dict.name, dict.description));
        }
        return dictToSend;
    }
    addDictionary(dictionary: Dictionary) {
        this.dictionaryList.push(dictionary);
    }
    modifyDictionary(index: number, dictionary: Dictionary) {
        this.dictionaryList[index] = dictionary;
    }
    deleteDictionary(index: number) {
        this.dictionaryList.splice(index, 1);
    }
    reinitialize() {
        this.dictionaryList.splice(1);
    }
    addFullDictionary(dictionary: Dictionary) {
        this.dictionaryList.push(dictionary);
    }
}
