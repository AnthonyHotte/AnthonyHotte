// eslint-disable-next-line no-restricted-imports
// eslint-disable-next-line import/no-unresolved
// import { PlaceLettersService } from '@app/services/place-letters.service';
export class Commands {
    debugCommand: boolean;
    // eslint-disable-next-line deprecation/deprecation
    // injector = Injector.create([{ provide: PlaceLettersService }]);
    constructor() {
        this.debugCommand = false;
    }
    /*
    chooseCommands(command: string) {
        // const test: PlaceLettersService = this.injector.get(PlaceLettersService);
        // this.placeLettersService= this.injector.get(PlaceLettersService)
        // if (command === '!debug') {
        //    this.activateDebugCommand();
        //    test.placeWord('A1v allo');
       // } else if (command.substring(0, Constants.PLACERCOMMANDLENGTH) === '!placer') {
        //    this.activateDebugCommand();
       // }
         const test: PlaceLettersService = this.injector.get(PlaceLettersService);
         switch (command) {
         case '!debug':
            this.activateDebugCommand();
            test.placeWord('A1v allo');
         }
    } */

    activateDebugCommand() {
        this.debugCommand = true;
        return this.debugCommand;
    }
}
