import { Dictionary } from '@app/classes/dictionary';
import { Service } from 'typedi';
import jsonDictionnary from '@app/dictionnary.json';

@Service()
export class DictionaryService {
    dictionaryList: Dictionary[];
    constructor() {
        const temp = JSON.parse(JSON.stringify(jsonDictionnary));
        this.dictionaryList = [new Dictionary(temp.title, temp.description)];
        this.dictionaryList[0].content = temp.words;
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
}
