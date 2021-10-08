import { Component } from '@angular/core';
import { LetterService } from '@app/services/letter.service';
import { TimerTurnManagerService } from '@app/services/timer-turn-manager.service';
import { MAXLETTERINHAND } from '@app/constants';
import { LetterBankService } from '@app/services/letter-bank.service';

@Component({
    selector: 'app-exchange-letters-gui',
    templateUrl: './exchange-letters-gui.component.html',
    styleUrls: ['./exchange-letters-gui.component.scss'],
})
export class ExchangeLettersGUIComponent {
    constructor(private timeManager: TimerTurnManagerService, private letterService: LetterService, private letterBankService: LetterBankService) {}
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
        this.cancelSelection();
        this.timeManager.endTurn('exchange');
    }
    cancelSelection() {
        this.letterService.removeAttributesExchange();
    }
}
