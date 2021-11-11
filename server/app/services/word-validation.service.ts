import { Service } from 'typedi';
import { DictionaryService } from './dictionary.service';

@Service()
export class WordValidationService {
    dictionnary: string[];
    dicLength: number;

    constructor(private dictionaryService: DictionaryService) {
        this.dictionnary = dictionaryService.getDictWithContent(this.dictionaryService.indexDictionaryInUse).content;
        this.dicLength = this.dictionnary.length;
    }

    // The binary search was inspired by the binarysearch method provided here https://www.geeksforgeeks.org/binary-search/
    isWordValid(word: string): boolean {
        return this.isWordInDictionnary(word) && this.isWordLongerThanTwo(word);
    }

    isWordLongerThanTwo(word: string): boolean {
        if (word.length >= 2) {
            return true;
        } else {
            return false;
        }
    }

    private isWordInDictionnary(word: string): boolean {
        const normalizedWord = word.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        let normalizedDicWord: string;
        let m: number;
        let l = 0;
        let r = this.dicLength - 1;
        while (l <= r) {
            m = l + Math.floor((r - l) / 2);
            normalizedDicWord = this.dictionnary[m].normalize('NFD').replace(/[\u0300-\u036f]/g, '');

            if (normalizedDicWord === normalizedWord) {
                return true;
            }

            if (normalizedDicWord < normalizedWord) {
                l = m + 1;
            } else {
                r = m - 1;
            }
        }

        return false;
    }
}
