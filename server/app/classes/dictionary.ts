export class Dictionary {
    name: string;
    description: string;
    content: string[];
    constructor(name: string, description: string) {
        this.name = name;
        this.description = description;
        this.content = [];
    }
}
