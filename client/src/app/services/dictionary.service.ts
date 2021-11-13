import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    indexDictionary: number;
    dictionaryList: Dictionary[];
    isUploadComplete: boolean;
    constructor(private communicationService: CommunicationService) {
        // default dictionary
        this.dictionaryList = [];
        this.indexDictionary = 0;
        this.isUploadComplete = false;
    }
    getDictionary() {
        this.communicationService.getFullDictionary(this.indexDictionary).subscribe((res) => {
            const dict = new Dictionary('', '');
            dict.title = res.title;
            dict.description = res.description;
            for (const word of res.words) {
                dict.words.push(word);
            }
            this.dictionaryList.push(dict);
            /*
            this.dictionaryList[this.indexDictionary].title = res.title;
            this.dictionaryList[this.indexDictionary].description = res.description;
            this.dictionaryList[this.indexDictionary].words = [];
            for (const word of res.words) {
                this.dictionaryList[this.indexDictionary].words.push(word);
            }*/
        });
    }
}
