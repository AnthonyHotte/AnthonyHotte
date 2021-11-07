import { Component } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    dictionaryList: Dictionary[];
    isDeleteMode: boolean;
    dictionaryNumberInput: number;
    newNameInput: string;
    newDescriptionInput: string;
    showModifyButton: boolean;
    showDeleteDictionaryButton: boolean;
    showNumberInput: boolean;
    showNumberMessageError: boolean;
    showNewNameInput: boolean;
    showNewNameMessageError: boolean;
    showNewDescriptionInput: boolean;
    showNewDescriptionMessageError: boolean;
    constructor() {
        this.dictionaryList = [];
        this.dictionaryList.push(new Dictionary('dict de base', 'description 0'));
        this.dictionaryList.push(new Dictionary('dict1', 'description 1'));
        this.showModifyButton = true;
        this.showDeleteDictionaryButton = true;
        this.showNumberInput = false;
        this.showNewNameInput = false;
        this.showNewDescriptionInput = false;
        this.showNumberMessageError = false;
        this.showNewNameMessageError = false;
        this.showNewDescriptionMessageError = false;
        this.isDeleteMode = false;
    }
    validateNumber() {
        if (this.dictionaryNumberInput < 1 || this.dictionaryNumberInput >= this.dictionaryList.length) {
            this.showNumberMessageError = true;
        } else if (this.isDeleteMode) {
            this.dictionaryList.splice(this.dictionaryNumberInput, 1);
            this.showNumberInput = false;
            this.isDeleteMode = false;
            this.showModifyButton = true;
            this.showDeleteDictionaryButton = true;
        } else {
            this.showNumberInput = false;
            this.showNewNameInput = true;
        }
    }
    validateNewName() {
        let nameExiste = false;
        for (const dictionary of this.dictionaryList) {
            if (this.newNameInput === dictionary.name) {
                nameExiste = true;
                break;
            }
        }
        if (this.newNameInput === undefined || nameExiste) {
            this.showNewNameMessageError = true;
        } else {
            this.showNewNameInput = false;
            this.showNewDescriptionInput = true;
        }
    }
}
