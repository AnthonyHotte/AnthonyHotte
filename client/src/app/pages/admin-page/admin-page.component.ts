import { Component } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    dictionaryList: Dictionary[];
    dictionaryNumberInput: number;
    newNameInput: number;
    showModifyButton: boolean;
    showNumberInput: boolean;
    showNewNameInput: boolean;
    showNewDescriptionInput: boolean;
    constructor() {
        this.dictionaryList = [];
        this.dictionaryList.push(new Dictionary('dict de base', 'description 0'));
        this.dictionaryList.push(new Dictionary('dict1', 'description 1'));
        this.showModifyButton = true;
        this.showNumberInput = false;
        this.showNewNameInput = false;
        this.showNewDescriptionInput = false;
    }
}
