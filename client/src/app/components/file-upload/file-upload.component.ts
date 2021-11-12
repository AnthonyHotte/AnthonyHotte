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

    fileName = '';
    uploadProgress: number | null;
    uploadSub: Subscription | null;

    constructor(private communicationService: CommunicationService, private dictionaryService: DictionaryService) {}

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

                    const title = dictionaryJson.title;
                    const dictionary = new Dictionary(title, dictionaryJson.description);
                    dictionary.content = [];
                    for (const word of dictionaryJson.words) {
                        dictionary.content.push(word);
                    }
                    this.communicationService.sendNewDictionary(dictionary).subscribe();
                    this.dictionaryService.dictionaryList.push(dictionary);
                    this.dictionaryService.isUploadComplete = true;
                };
            }
        }
    }
}
