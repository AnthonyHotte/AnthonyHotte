import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { LetterService } from './letter.service';

@Injectable({
  providedIn: 'root'
})
export class SoloPlayerService {
    
    message: string;
    subscription: Subscription;
    private letters: LetterService;
  
    constructor() { this.subscription = this.letters.currentMessage.subscribe(message => this.message = message); }

    sendMessage(message: string[]) {
      this.subject.next(message);
      this.message = message;
  }
  
  
}
