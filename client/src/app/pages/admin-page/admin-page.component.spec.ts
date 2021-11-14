import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { Observable } from 'rxjs';

import { AdminPageComponent } from './admin-page.component';

describe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', [
            'getDictionaryList',
            'reinitialiseDictionary',
            'sendDictionaryNameChanged',
            'sendDeleteDictionary',
            'getFullDictionary',
        ]);
        communicationServiceSpy.getDictionaryList.and.returnValue(new Observable());
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['getDictionary']);
        dictionaryServiceSpy.dictionaryList = [];
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t1', 'd1'));
        dictionaryServiceSpy.dictionaryList[0].title = 't1';
        dictionaryServiceSpy.dictionaryList[0].description = 'd1';
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t2', 'd2'));
        dictionaryServiceSpy.dictionaryList[1].title = 't2';
        dictionaryServiceSpy.dictionaryList[1].description = 'd2';
        dictionaryServiceSpy.indexDictionary = 0;
        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent],
            providers: [
                { provide: CommunicationService, useValue: communicationServiceSpy },
                { provide: DictionaryService, useValue: dictionaryServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        component.dictionaryNumberInput = 0;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('showOrHideDictionaryButton should hide button', () => {
        component.showOrHideDictionaryButton(false);
        expect(component.showModifyButton).toBe(false);
    });
    it('validateNumber should call getFullDictionary', () => {
        component.isDownloadMode = true;
        dictionaryServiceSpy.dictionaryList = [];
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t1', 'd1'));
        dictionaryServiceSpy.dictionaryList[0].title = 't1';
        dictionaryServiceSpy.dictionaryList[0].description = 'd1';
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t2', 'd2'));
        dictionaryServiceSpy.dictionaryList[1].title = 't2';
        dictionaryServiceSpy.dictionaryList[1].description = 'd2';
        const spy = spyOn(component, 'getFullDictionary');
        component.validateNumber();
        expect(spy).toHaveBeenCalled();
    });
    it('validateNumber should send error message', () => {
        component.isDownloadMode = false;
        component.dictionaryNumberInput = 0;
        component.showNumberMessageError = false;
        component.validateNumber();
        expect(component.showNumberMessageError).toBe(true);
    });
    it('validateNumber should send error message when dictionary list empty', () => {
        component.isDownloadMode = false;
        dictionaryServiceSpy.dictionaryList = [];
        component.dictionaryNumberInput = 2;
        component.showNumberMessageError = false;
        component.validateNumber();
        expect(component.showNumberMessageError).toBe(true);
    });
    it('validateNumber should call send delete', () => {
        dictionaryServiceSpy.dictionaryList = [];
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t1', 'd1'));
        dictionaryServiceSpy.dictionaryList[0].title = 't1';
        dictionaryServiceSpy.dictionaryList[0].description = 'd1';
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t2', 'd2'));
        dictionaryServiceSpy.dictionaryList[1].title = 't2';
        dictionaryServiceSpy.dictionaryList[1].description = 'd2';
        component.isDownloadMode = false;
        component.dictionaryNumberInput = 1;
        const spy = spyOn(component, 'sendDeleteDictionaryServer');
        component.isDeleteMode = true;
        component.validateNumber();
        expect(spy).toHaveBeenCalled();
    });
    it('validateNumber should switch showNewNameInput to true', () => {
        dictionaryServiceSpy.dictionaryList = [];
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t1', 'd1'));
        dictionaryServiceSpy.dictionaryList[0].title = 't1';
        dictionaryServiceSpy.dictionaryList[0].description = 'd1';
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t2', 'd2'));
        dictionaryServiceSpy.dictionaryList[1].title = 't2';
        dictionaryServiceSpy.dictionaryList[1].description = 'd2';
        component.isDownloadMode = false;
        component.dictionaryNumberInput = 1;
        component.isDeleteMode = false;
        component.showNewNameInput = false;
        component.validateNumber();
        expect(component.showNewNameInput).toBe(true);
    });
    it('showOrHideJVButton should hide button', () => {
        component.showAddJVnameButton = true;
        component.showOrHideJVButton(false);
        expect(component.showAddJVnameButton).toBe(false);
    });
    it('validateNewName should show error message when name existe', () => {
        dictionaryServiceSpy.dictionaryList = [];
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t1', 'd1'));
        dictionaryServiceSpy.dictionaryList[0].title = 't1';
        dictionaryServiceSpy.dictionaryList[0].description = 'd1';
        component.showAddJVnameButton = true;
        component.newNameInput = 't1';
        component.showNewNameMessageError = false;
        component.validateNewName();
        expect(component.showNewNameMessageError).toBe(true);
    });
    it('validateNewName should not show error message when name does not existe', () => {
        component.showAddJVnameButton = true;
        component.newNameInput = 't4';
        component.showNewNameMessageError = false;
        component.validateNewName();
        expect(component.showNewNameMessageError).toBe(false);
    });
    it('saveJVName should show error message', () => {
        component.showJVNameMessageError = false;
        const spy = spyOn(component, 'validateJVName').and.returnValue(false);
        component.saveJVName();
        expect(spy).toHaveBeenCalled();
        expect(component.showJVNameMessageError).toBe(true);
    });
    it('saveJVName should call push method', () => {
        component.indexJVName = -1;
        const spy = spyOn(component, 'validateJVName').and.returnValue(true);
        component.modeJV = 0;
        component.nameJV = [[], []];
        const spy2 = spyOn(component.nameJV[component.modeJV], 'push');
        component.saveJVName();
        expect(spy).toHaveBeenCalled();
        expect(component.showJVNameMessageError).toBe(false);
        expect(spy2).toHaveBeenCalled();
    });
    it('saveJVName should not call push method', () => {
        component.indexJVName = 0;
        const spy = spyOn(component, 'validateJVName').and.returnValue(true);
        component.modeJV = 0;
        component.nameJV = [[], []];
        const spy2 = spyOn(component.nameJV[component.modeJV], 'push');
        component.saveJVName();
        expect(spy).toHaveBeenCalled();
        expect(component.showJVNameMessageError).toBe(false);
        expect(spy2).toHaveBeenCalledTimes(0);
    });
    it('validateJVName should return false when name empty', () => {
        component.newNameJV = '';
        const res = component.validateJVName();
        expect(res).toBe(false);
    });
    it('validateJVName should return false when name already in list', () => {
        component.newNameJV = 't1';
        component.modeJV = 0;
        component.nameJV = [['t1'], []];
        const res = component.validateJVName();
        expect(res).toBe(false);
    });
    it('validateJVName should return true when name valide', () => {
        component.newNameJV = 't2';
        component.modeJV = 0;
        component.nameJV = [['t1'], []];
        const res = component.validateJVName();
        expect(res).toBe(true);
    });
    it('validateIndexJV should show error message when index smaller then 3', () => {
        component.indexJVName = 0;
        component.showJVIndexMessageError = false;
        component.modeJV = 0;
        component.nameJV = [['t1', 't2', 't3', 't4'], []];
        component.validateIndexJV();
        expect(component.showJVIndexMessageError).toBe(true);
    });
    it('validateIndexJV should show error message when index too big', () => {
        component.indexJVName = 8;
        component.showJVIndexMessageError = false;
        component.modeJV = 0;
        component.nameJV = [['t1', 't2', 't3', 't4'], []];
        component.validateIndexJV();
        expect(component.showJVIndexMessageError).toBe(true);
    });
    it('validateIndexJV should show error message when number valid and delete mode', () => {
        component.indexJVName = 3;
        component.showJVIndexMessageError = false;
        component.modeJV = 0;
        component.isToDeleteJV = true;
        component.nameJV = [['t1', 't2', 't3', 't4'], []];
        component.validateIndexJV();
        expect(component.showJVIndexMessageError).toBe(false);
    });
    it('validateIndexJV should show error message when number valid', () => {
        component.indexJVName = 3;
        component.showJVIndexMessageError = false;
        component.modeJV = 0;
        component.isToDeleteJV = false;
        component.nameJV = [['t1', 't2', 't3', 't4'], []];
        component.validateIndexJV();
        expect(component.showJVIndexMessageError).toBe(false);
    });
    it('addNameJV should put indexJVName to -1', () => {
        component.indexJVName = 0;
        const result = -1;
        component.addNameJV(0);
        expect(component.indexJVName).toEqual(result);
    });
    it('modifyJVName should put modeJV to 0', () => {
        component.modeJV = 1;
        component.modifyJVName(0);
        expect(component.modeJV).toEqual(0);
    });
    it('deleteJVName should put modeJV to 0', () => {
        component.isToDeleteJV = false;
        component.deleteJVName(0);
        expect(component.modeJV).toEqual(0);
        expect(component.isToDeleteJV).toBe(true);
    });
    it('reinitialize should reinitialize propely', () => {
        component.nameJV = [
            ['j1', 'j2', 'j3'],
            ['j1', 'j2', 'j3'],
        ];
        dictionaryServiceSpy.dictionaryList = [];
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t1', 'd1'));
        dictionaryServiceSpy.dictionaryList[0].title = 't1';
        dictionaryServiceSpy.dictionaryList[0].description = 'd1';
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t2', 'd2'));
        dictionaryServiceSpy.dictionaryList[1].title = 't2';
        dictionaryServiceSpy.dictionaryList[1].description = 'd2';
        communicationServiceSpy.reinitialiseDictionary.and.returnValue(new Observable());
        component.reinitialize();
        expect(dictionaryServiceSpy.dictionaryList.length).toEqual(1);
    });
    it('saveDictionaryModificatione should put showNewDescriptionInput to false', () => {
        dictionaryServiceSpy.dictionaryList.push(new Dictionary('t1', 'd1'));
        dictionaryServiceSpy.dictionaryList[0].title = 't1';
        dictionaryServiceSpy.dictionaryList[0].description = 'd1';
        component.showNewDescriptionInput = true;
        component.dictionaryNumberInput = 0;
        communicationServiceSpy.sendDictionaryNameChanged.and.returnValue(new Observable());
        component.saveDictionaryModification();
        expect(component.showNewDescriptionInput).toBe(false);
    });
    it('sendModificationNamesToServer should call sendDictionaryNameChanged', () => {
        communicationServiceSpy.sendDictionaryNameChanged.and.returnValue(new Observable());
        component.sendModificationNamesToServer();
        expect(communicationServiceSpy.sendDictionaryNameChanged).toHaveBeenCalled();
    });
    it('getFullDictionary should call getFullDictionary', () => {
        communicationServiceSpy.getFullDictionary.and.returnValue(new Observable());
        component.getFullDictionary();
        expect(communicationServiceSpy.getFullDictionary).toHaveBeenCalled();
    });
    it('sendDeleteDictionaryServer should call getFullDictionary', () => {
        communicationServiceSpy.sendDeleteDictionary.and.returnValue(new Observable());
        component.sendDeleteDictionaryServer();
        expect(communicationServiceSpy.sendDeleteDictionary).toHaveBeenCalled();
    });
});
