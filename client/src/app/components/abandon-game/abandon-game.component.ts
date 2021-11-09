import { Component, HostListener, OnDestroy } from '@angular/core';
import { TextBox } from '@app/classes/text-box-behavior';
import { FinishGameService } from '@app/services/finish-game.service';
import { SocketService } from '@app/services/socket.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-abandon-game',
    templateUrl: './abandon-game.component.html',
    styleUrls: ['./abandon-game.component.scss'],
})
export class AbandonGameComponent implements OnDestroy {
    validationNecessary = false;
    subscription: Subscription; // useful for updating views and current value : we observe the value of socketService

    constructor(private finishGameService: FinishGameService, private socketService: SocketService, private textBox: TextBox) {
        this.subscription = this.socketService.currentEndGameValue.subscribe(
            (valueOfEndGame) => (this.finishGameService.isGameFinished = valueOfEndGame),
        );
    }

    @HostListener('window:beforeunload', ['$event'])
    beforeUnloadHandler() {
        this.socketService.handleDisconnect();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    finishCurrentGame() {
        this.textBox.isCommand('!abandonner');
        this.socketService.finishedGameMessageTransmission();
    }
}
