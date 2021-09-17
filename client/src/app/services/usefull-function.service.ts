import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class UsefullFunctionService {
    // function to read text file
    fileReaderFunction = (path: string): string => {
        const fileReader = new FileReader();
        const file: File = new File([''], path);
        fileReader.readAsText(file);
        if (typeof fileReader.result === 'string') {
            return fileReader.result;
        } else {
            return '';
        }
    };
}
