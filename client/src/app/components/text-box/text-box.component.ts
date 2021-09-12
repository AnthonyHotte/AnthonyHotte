import { Component, HostListener, OnInit } from '@angular/core';
import { TextBoxService } from '@app/services/text-box.service';

@Component({
    selector: 'app-text-box',
    templateUrl: './text-box.component.html',
    styleUrls: ['./text-box.component.scss'],
})
export class TextBoxComponent implements OnInit {
    buttonPressed = '';
    buttonCode: number;
    word = '';
    array: string[] = [];
    alertMessage = '';

    constructor(private mytextBoxService: TextBoxService) {}

    @HostListener('keydown', ['$event'])
    buttonDetect(event: KeyboardEvent) {
        this.buttonPressed = event.key;
        this.buttonCode = event.keyCode;
        this.mytextBoxService.inputChecking(this.buttonCode, this.buttonPressed);
        this.word = this.mytextBoxService.word;
        this.array = this.mytextBoxService.array;
        this.alertMessage = this.mytextBoxService.alertMessage;
    }

    ngOnInit(): void {}
}
