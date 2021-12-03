import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dictionary } from '@app/classes/dictionary';
import { CommunicationService } from '@app/services/communication.service';
import { DictionaryService } from '@app/services/dictionary.service';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
    let component: FileUploadComponent;
    let fixture: ComponentFixture<FileUploadComponent>;
    let dictionaryServiceSpy: jasmine.SpyObj<DictionaryService>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', ['getFullDictionary']);
        dictionaryServiceSpy = jasmine.createSpyObj('DictionaryService', ['getDictionary', 'isTitlePresent']);
        dictionaryServiceSpy.dictionaryList = [new Dictionary('t1', 'd1'), new Dictionary('t2', 'd2')];
        TestBed.configureTestingModule({
            providers: [
                { provide: DictionaryService, useValue: dictionaryServiceSpy },
                { provide: CommunicationService, useValue: communicationServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(FileUploadComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('isValidDictionary should return true when valide', () => {
        dictionaryServiceSpy.isTitlePresent.and.returnValue(false);
        const res = component.isValidDictionary('t3', 'd3');
        expect(res).toBe(true);
    });
    it('isValidDictionary should return false when invalide', () => {
        dictionaryServiceSpy.isTitlePresent.and.returnValue(true);
        const res = component.isValidDictionary('t1', 'd1');
        expect(res).toBe(false);
    });
});
