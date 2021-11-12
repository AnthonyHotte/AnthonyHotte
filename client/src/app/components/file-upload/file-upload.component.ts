import { Component, Input } from '@angular/core';
import { CommunicationService } from '@app/services/communication.service';

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
    constructor(private communicationService: CommunicationService) {}

    onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target !== null && target.files !== null) {
            const file: File | null = target.files[0];

            if (file) {
                const fileReader = new FileReader();
                fileReader.readAsText(file, 'utf8');
                fileReader.onload = () => {
                    const dictionary = JSON.parse(JSON.stringify(fileReader.result));
                    this.communicationService.sendNewDictionary(dictionary).subscribe();
                };
            }
        }
    }
}
