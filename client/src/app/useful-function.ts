// function to read text file
export const fileReaderFunction = (path: string): string => {
    const fileReader = new FileReader();
    const file: File = new File([''], path);
    fileReader.readAsText(file);
    if (typeof fileReader.result === 'string') {
        return fileReader.result;
    } else {
        return '';
    }
};
