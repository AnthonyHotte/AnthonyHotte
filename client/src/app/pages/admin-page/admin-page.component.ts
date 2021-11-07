import { Component } from '@angular/core';
import { Dictionary } from '@app/classes/dictionary';
import { ERRORCODE } from '@app/constants';

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

    nameJV: string[][]; // JV easy name index 0, JVHard name index 1
    newNameJV: string;
    modeJV: number; // 0 for easyJV 1 for HardJV
    indexJVName: number; // -1 if we want to add it at the end
    isToDeleteJV: boolean;
    showInputJVName: boolean;
    showInputJVIndex: boolean;
    showJVNameMessageError: boolean;
    showJVIndexMessageError: boolean;
    showAddJVnameButton: boolean;
    showModifyJVNameButton: boolean;
    showDeleteJVNameButton: boolean;
    constructor() {
        this.dictionaryList = [];
        // index 0 is default dictionary
        this.dictionaryList.push(new Dictionary('dict de base', 'description 0'));
        this.dictionaryList.push(new Dictionary('dict1', 'description 1'));
        this.nameJV = [
            ['JV1', 'JV2', 'JV3'],
            ['JVHard1', 'JVHard2'],
        ];
        this.newNameJV = '';
        this.newNameInput = '';
        this.isToDeleteJV = false;
        this.showModifyButton = true;
        this.showDeleteDictionaryButton = true;
        this.showNumberInput = false;
        this.showNewNameInput = false;
        this.showNewDescriptionInput = false;
        this.showNumberMessageError = false;
        this.showNewNameMessageError = false;
        this.showNewDescriptionMessageError = false;
        this.isDeleteMode = false;
        this.showInputJVName = false;
        this.showJVNameMessageError = false;
        this.showInputJVIndex = false;
        this.showJVIndexMessageError = false;
        this.showOrHideJVButton(true);
    }
    validateNumber() {
        if (this.dictionaryNumberInput < 1 || this.dictionaryNumberInput >= this.dictionaryList.length) {
            this.showNumberMessageError = true;
        } else if (this.isDeleteMode) {
            this.dictionaryList.splice(this.dictionaryNumberInput, 1);
            // TODO
            // delete the dict dictionaryNumberInput on server
            this.showNumberInput = false;
            this.isDeleteMode = false;
            this.showModifyButton = true;
            this.showDeleteDictionaryButton = true;
            this.showNumberMessageError = false;
        } else {
            this.showNumberMessageError = false;
            this.showNumberInput = false;
            this.showNewNameInput = true;
        }
    }
    showOrHideJVButton(show: boolean) {
        this.showAddJVnameButton = show;
        this.showModifyJVNameButton = show;
        this.showDeleteJVNameButton = show;
    }
    validateNewName() {
        let nameExiste = false;
        for (const dictionary of this.dictionaryList) {
            if (this.newNameInput === dictionary.name) {
                nameExiste = true;
                break;
            }
        }
        if (this.newNameInput === '' || nameExiste) {
            this.showNewNameMessageError = true;
        } else {
            this.showNewNameInput = false;
            this.showNewDescriptionInput = true;
            this.showNewNameMessageError = false;
        }
    }
    saveJVName() {
        if (this.validateJVName()) {
            if (this.indexJVName === ERRORCODE) {
                this.showJVNameMessageError = false;
                this.nameJV[this.modeJV].push(this.newNameJV);
                this.showInputJVName = false;
                this.showOrHideJVButton(true);
                this.sendJVNameChanges(this.modeJV);
            } else {
                this.showJVNameMessageError = false;
                this.nameJV[this.modeJV][this.indexJVName] = this.newNameJV;
                this.showInputJVName = false;
                this.showOrHideJVButton(true);
                this.sendJVNameChanges(this.modeJV);
            }
        } else {
            this.showJVNameMessageError = true;
        }
    }
    validateJVName(): boolean {
        if (this.newNameJV === '') {
            return false;
        }
        for (const name of this.nameJV[this.modeJV]) {
            if (this.newNameJV === name) {
                return false;
            }
        }
        return true;
    }
    validateIndexJV() {
        if (this.indexJVName < 3 || this.indexJVName >= this.nameJV[this.modeJV].length) {
            this.showJVIndexMessageError = true;
        } else if (this.isToDeleteJV) {
            this.showJVIndexMessageError = false;
            this.showInputJVIndex = false;
            this.showOrHideJVButton(true);
            this.nameJV[this.modeJV].splice(this.indexJVName, 1);
            this.sendJVNameChanges(this.modeJV);
        } else {
            this.showInputJVIndex = false;
            this.showJVIndexMessageError = false;
            this.showInputJVName = true;
        }
    }
    addNameJV(mode: number) {
        this.showOrHideJVButton(false);
        this.showInputJVName = true;
        this.modeJV = mode;
        this.indexJVName = -1;
    }
    modifyJVName(mode: number) {
        this.showOrHideJVButton(false);
        this.showInputJVIndex = true;
        this.modeJV = mode;
        this.isToDeleteJV = false;
    }
    deleteJVName(mode: number) {
        this.showOrHideJVButton(false);
        this.showInputJVIndex = true;
        this.modeJV = mode;
        this.isToDeleteJV = true;
    }
    sendChangesToServer() {
        this.showNewDescriptionInput = false;
        this.showModifyButton = true;
        // TODO
        // send changes to server
    }
    // eslint-disable-next-line no-unused-vars
    sendJVNameChanges(mode: number) {
        // TODO
        // send to mongo name
    }
}
