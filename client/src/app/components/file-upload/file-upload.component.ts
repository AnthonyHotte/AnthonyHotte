import { Component, Input } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { Subscription } from 'rxjs';

// inspired from https://blog.angular-university.io/angular-file-upload/

@Component({
    selector: 'app-file-upload',
    templateUrl: 'file-upload.component.html',
    styleUrls: ['file-upload.component.scss'],
})
export class FileUploadComponent {
    @Input()
    requiredFileType: string;
    showDownloadMessage: boolean;
    showDownload: boolean;
    dictionary: Dictionary;

    fileName = '';
    uploadProgress: number | null;
    uploadSub: Subscription | null;

    constructor(private communicationService: CommunicationService, private dictionaryService: DictionaryService) {
        this.showDownloadMessage = false;
        this.showDownload = false;
        this.dictionary = new Dictionary('', '');
    }
    isValidDictionary(title: string, description: string) {
        if (title === undefined || description === undefined || this.dictionaryService.isTitlePresent(title)) {
            return false;
        }
        return true;
    }

    onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target !== null && target.files !== null) {
            const file: File | null = target.files[0];

            if (file) {
                this.fileName = file.name;
                const fileReader = new FileReader();
                fileReader.readAsText(file, 'utf8');
                fileReader.onload = () => {
                    const dictionaryJson = JSON.parse(fileReader.result as string);
                    if (this.isValidDictionary(dictionaryJson.title, dictionaryJson.description) && dictionaryJson.words.length > 0) {
                        this.dictionary.title = dictionaryJson.title;
                        this.dictionary.description = dictionaryJson.description;
                        this.dictionary.words = [];
                        for (const word of dictionaryJson.words) {
                            this.dictionary.words.push(word);
                        }
                        // succeded
                        this.communicationService.sendNewDictionary(this.dictionary).subscribe();
                        this.dictionaryService.dictionaryList.push(this.dictionary);
                        this.showDownload = true;
                        this.dictionaryService.isUploadComplete = true;
                    } else {
                        this.showDownloadMessage = true;
                    }
                };
            }
        }
    }
}
