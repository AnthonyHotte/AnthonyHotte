import { Component } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Dictionary } from '@app/classes/dictionary';
import { ERRORCODE } from '@app/constants';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryService } from '@app/services/dictionary.service';

@Component({
    selector: 'app-admin-page',
    templateUrl: './admin-page.component.html',
    styleUrls: ['./admin-page.component.scss'],
})
export class AdminPageComponent {
    downloadUrl: SafeUrl;
    showDownloadUrl: boolean;
    isDeleteMode: boolean;
    dictionaryNumberInput: number;
    newNameInput: string;
    newDescriptionInput: string;
    isDownloadMode: boolean;
    showModifyButton: boolean;
    showDeleteDictionaryButton: boolean;
    showNumberInput: boolean;
    showNumberMessageError: boolean;
    showNewNameInput: boolean;
    showNewNameMessageError: boolean;
    showNewDescriptionInput: boolean;
    showNewDescriptionMessageError: boolean;
    showDownloadButton: boolean;
    showUpLoadButton: boolean;
    showUpload: boolean;

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
    constructor(
        private readonly communicationService: CommunicationService,
        private readonly sanitizer: DomSanitizer,
        public dictionaryService: DictionaryService,
    ) {
        this.dictionaryService.dictionaryList = [];
        this.nameJV = [
            ['JV1', 'JV2', 'JV3'],
            ['JVHard1', 'JVHard2', 'JVHard3'],
        ];
        this.communicationService.getDictionaryList().subscribe((result: Dictionary[]) => {
            result.forEach((res) => {
                this.dictionaryService.dictionaryList.push(res);
            });
        });
        this.newNameJV = '';
        this.newNameInput = '';
        this.isToDeleteJV = false;
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
        this.showDownloadUrl = false;
        this.isDownloadMode = false;
        this.showUpload = false;
        this.showOrHideDictionaryButton(true);
        this.showOrHideJVButton(true);
    }
    showOrHideDictionaryButton(show: boolean) {
        this.showModifyButton = show;
        this.showDeleteDictionaryButton = show;
        this.showDownloadButton = show;
        this.showUpLoadButton = show;
    }

    validateNumber() {
        if (this.isDownloadMode && this.dictionaryNumberInput >= 0 && this.dictionaryNumberInput < this.dictionaryService.dictionaryList.length) {
            this.isDownloadMode = false;
            this.showNumberMessageError = false;
            this.showNumberInput = false;
            this.getFullDictionary();
            this.showDownloadUrl = true;
        } else if (this.dictionaryNumberInput < 1 || this.dictionaryNumberInput >= this.dictionaryService.dictionaryList.length) {
            this.showNumberMessageError = true;
        } else if (this.isDeleteMode) {
            this.dictionaryService.dictionaryList.splice(this.dictionaryNumberInput, 1);
            this.sendDeleteDictionaryServer();
            this.showNumberInput = false;
            this.isDeleteMode = false;
            this.showOrHideDictionaryButton(true);
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
        for (const dictionary of this.dictionaryService.dictionaryList) {
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
    reinitialize() {
        this.dictionaryService.dictionaryList.splice(1);
        this.nameJV[0].splice(3);
        this.nameJV[1].splice(3);
        this.communicationService.reinitialiseDictionary().subscribe();
        // TODO
        // mogo gerer nameJV
    }
    saveDictionaryModification() {
        this.showNewDescriptionInput = false;
        this.showOrHideDictionaryButton(true);
        this.dictionaryService.dictionaryList[this.dictionaryNumberInput].name = this.newNameInput;
        this.dictionaryService.dictionaryList[this.dictionaryNumberInput].description = this.newDescriptionInput;
        this.sendModificationNamesToServer();
    }
    sendModificationNamesToServer() {
        this.communicationService
            .sendDictionaryNameChanged({
                index: this.dictionaryNumberInput,
                dictionary: this.dictionaryService.dictionaryList[this.dictionaryNumberInput],
            })
            .subscribe();
    }
    getFullDictionary() {
        this.communicationService.getFullDictionary(this.dictionaryNumberInput).subscribe((res) => {
            const data = JSON.stringify(res);
            this.downloadUrl = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(data));
        });
    }
    sendDeleteDictionaryServer() {
        this.communicationService.sendDeleteDictionary(this.dictionaryNumberInput).subscribe();
    }
    // eslint-disable-next-line no-unused-vars
    sendJVNameChanges(mode: number) {
        // TODO
        // send to mongo name
    }
}
