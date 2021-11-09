import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { MAXPERCENTAGE } from '@app/constants';
import { Subscription } from 'rxjs';
import { finalize } from 'rxjs/operators';

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

    constructor(private http: HttpClient) {}

    onFileSelected(event: Event) {
        const target = event.target as HTMLInputElement;
        if (target !== null && target.files !== null) {
            const file: File | null = target.files[0];

            if (file) {
                this.fileName = file.name;
                const formData = new FormData();
                formData.append('newFile', file);

                const upload$ = this.http
                    .post('/api/dictionary/newdictionary', formData, {
                        reportProgress: true,
                        observe: 'events',
                    })
                    .pipe(finalize(() => this.reset()));

                this.uploadSub = upload$.subscribe((eventReceive) => {
                    if (eventReceive.type === HttpEventType.UploadProgress && eventReceive.total !== undefined) {
                        this.uploadProgress = Math.round(MAXPERCENTAGE * (eventReceive.loaded / eventReceive.total));
                    }
                });
            }
        }
    }

    cancelUpload() {
        if (this.uploadSub !== null) {
            this.uploadSub.unsubscribe();
        }
        this.reset();
    }

    reset() {
        this.uploadProgress = null;
        this.uploadSub = null;
    }
}
