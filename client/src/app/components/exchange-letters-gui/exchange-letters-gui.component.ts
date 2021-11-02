import { Component } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { MAXLETTERINHAND } from '@app/constants';
import { MessagePlayer } from '@app/message';
import { LetterBankService } from '@app/services/letter-bank.service';
import { LetterService } from '@app/services/letter.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';

@Component({
    selector: 'app-exchange-letters-gui',
    templateUrl: './exchange-letters-gui.component.html',
    styleUrls: ['./exchange-letters-gui.component.scss'],
})
export class ExchangeLettersGUIComponent {
    constructor(
        private timeManager: TimerTurnManagerService,
        private letterService: LetterService,
        private letterBankService: LetterBankService,
        private textBox: TextBox,
    ) {}
    isPlayerTurn(): boolean {
        return this.timeManager.turn === 0;
    }
    areLettersSelected(): boolean {
        return this.letterService.areLetterSelectedExchange;
    }
    areThereEnoughLettersInBank(): boolean {
        return this.letterBankService.letterBank.length >= MAXLETTERINHAND;
    }

    exchangeLetters(event: MouseEvent) {
        event.stopPropagation();
        this.textBox.isCommand('!échanger ' + this.letterService.lettersSelectedExchange);
        const message: MessagePlayer = {
            message: 'échanger ' + this.letterService.lettersSelectedExchange,
            sender: this.letterService.players[0].name,
            role: 'Joueur',
        };
        this.textBox.inputs.push(message);
        this.cancelSelection(event);
        this.timeManager.endTurn('exchange');
    }
    cancelSelection(event: MouseEvent) {
        event.stopPropagation();
        this.letterService.removeAttributesExchange();
    }
}
