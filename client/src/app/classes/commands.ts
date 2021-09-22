import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class Commands {
    debugCommand: boolean;

    constructor() {
        this.debugCommand = false;
    }

    chooseCommands(command: string) {
        switch (command) {
            case '!debug':
                this.activateDebugCommand();
        }
    }

    activateDebugCommand() {
        this.debugCommand = true;
        return this.debugCommand;
    }
}
