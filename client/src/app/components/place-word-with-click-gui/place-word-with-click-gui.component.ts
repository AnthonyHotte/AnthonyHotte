import { Component } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { PlaceLetterClickService } from '@app/services/place-letter-click.service';
import { PlaceLettersService } from '@app/services/place-letters.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-place-word-with-click-gui',
    templateUrl: './place-word-with-click-gui.component.html',
    styleUrls: ['./place-word-with-click-gui.component.scss'],
})
export class PlaceWordWithClickGuiComponent {
    constructor(
        private placeLetterClick: PlaceLetterClickService,
        private timeManger: TimerTurnManagerService,
        private placeLetterService: PlaceLettersService,
        private textBox: TextBox,
    ) {}

    verifyWordCreated(): boolean {
        if (this.placeLetterClick.isTileSelected && this.placeLetterClick.lettersFromHand.length > 0 && this.timeManger.turn === 0) {
            return true;
        }
        return false;
    }

    playWord() {
        const command = this.placeLetterService.submitWordMadeClick();
        this.textBox.send(command);
        this.textBox.isCommand(command.message);
    }
}
