export class Commands {
    debugCommand: boolean;

    constructor() {
        this.debugCommand = false;
    }

    chooseCommands(command: string) {
        switch (command) {
            case '!debug':
                debugCommand();
        }
    }

    debugCommand() {
        this.debugCommand = true;
        return this.debugCommand;
    }
}
