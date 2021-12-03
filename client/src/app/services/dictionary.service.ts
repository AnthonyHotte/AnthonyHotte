import { Injectable } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { BehaviorSubject } from 'rxjs';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class DictionaryService {
    indexDictionary: number;
    dictionaryList: Dictionary[];
    isUploadComplete: boolean;
    showUploadedInfo: boolean;
    showButton: BehaviorSubject<boolean[]>;
    constructor(private communicationService: CommunicationService) {
        // default dictionary
        this.dictionaryList = [];
        this.indexDictionary = 0;
        this.isUploadComplete = false;
        this.showUploadedInfo = false;
        this.showButton = new BehaviorSubject<boolean[]>([true, false]);
    }
    getDictionary() {
        this.communicationService.getFullDictionary(this.indexDictionary).subscribe((res) => {
            this.populateDictionary(res);
        });
    }
    populateDictionary(res: Dictionary) {
        const dict = new Dictionary('', '');
        dict.title = res.title;
        dict.description = res.description;
        for (const word of res.words) {
            dict.words.push(word);
        }
        this.dictionaryList.push(dict);
    }
    isTitlePresent(title: string) {
        for (const dictionary of this.dictionaryList) {
            if (title === dictionary.title) {
                return true;
            }
        }
        return false;
    }
}
