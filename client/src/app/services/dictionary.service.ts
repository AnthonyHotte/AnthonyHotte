import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    indexDictionary: number;
    dictionaryList: Dictionary[];
    dictionary: Dictionary;
    isUploadComplete: boolean;
    constructor(private communicationService: CommunicationService) {
        // default dictionary
        this.dictionaryList = [];
        this.indexDictionary = 0;
        this.isUploadComplete = false;
    }
    getDictionary() {
        this.communicationService.getFullDictionary(this.indexDictionary).subscribe((res) => {
            this.dictionary.name = res.name;
            this.dictionary.description = res.description;
            this.dictionary.content = [];
            for (const word of res.content) {
                this.dictionary.content.push(word);
            }
        });
    }
}
