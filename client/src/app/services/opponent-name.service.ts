import { Injectable } from '@angular/core';
import { CommunicationService } from './communication.service';

@Injectable({
    providedIn: 'root',
})
export class OpponentNameService {
    beginnerName: string[];
    expertName: string[];
    constructor(private communicationService: CommunicationService) {
        this.beginnerName = [];
        this.expertName = [];
        this.initiateSubscription();
    }
    initiateSubscription() {
        this.communicationService.getJVEasyNames().subscribe((result: string[]) => {
            result.forEach((res) => {
                this.beginnerName.push(res);
            });
        });
        this.communicationService.getJVHardNames().subscribe((result: string[]) => {
            result.forEach((res) => {
                this.expertName.push(res);
            });
        });
    }

    getOpponentName(nameEntered: string, expert: boolean): string {
        let opponentName: string;
        if (expert) {
            do {
                opponentName = this.expertName[Math.floor(Math.random() * this.expertName.length)];
            } while (nameEntered === opponentName.split(' ').join('').toLocaleLowerCase());
        } else {
            do {
                opponentName = this.beginnerName[Math.floor(Math.random() * this.beginnerName.length)];
            } while (nameEntered === opponentName.split(' ').join('').toLocaleLowerCase());
        }
        return opponentName;
    }
}
