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

    exchangeLetters() {
        this.letterService.players[this.timeManager.turn].exchangeLetters(this.letterService.lettersSelectedExchange);
        const message: MessagePlayer = { message: 'échanger ' + this.letterService.lettersSelectedExchange, sender: 'Joueur' };
        this.textBox.inputs.push(message);
        this.cancelSelection();
        this.timeManager.endTurn('exchange');
    }
    cancelSelection() {
        this.letterService.removeAttributesExchange();
    }
}
