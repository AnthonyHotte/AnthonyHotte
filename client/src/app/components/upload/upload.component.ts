import { Component } from '@angular/core';
import { FileUploadService } from '@app/services/file-upload.service';

@Component({
    selector: 'app-upload',
    templateUrl: './upload.component.html',
    styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
    // Variable to store shortLink from api response
    shortLink: string = '';
    loading: boolean = false; // Flag variable
    file: File; // Variable to store file

    // Inject service
    constructor(private fileUploadService: FileUploadService) {}

    // On file Select
    onChange(event: Event) {
        if (event !== null) {
            const target = event.target as HTMLInputElement;
            if (target.files !== null) {
                this.file = target.files[0];
            }
        }
    }

    // OnClick of button Upload
    onUpload() {
        this.loading = !this.loading;
        this.fileUploadService.upload(this.file).subscribe((event: unknown) => {
            if (typeof event === 'object') {
                // Short link via api response
                // this.shortLink = event.link;

                this.loading = false; // Flag variable
            }
        });
    }
}
