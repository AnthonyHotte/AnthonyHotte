export class Dictionary {
    title: string;
    description: string;
    words: string[];
    constructor(name: string, description: string) {
        this.title = name;
        this.description = description;
        this.words = [];
    }
}
