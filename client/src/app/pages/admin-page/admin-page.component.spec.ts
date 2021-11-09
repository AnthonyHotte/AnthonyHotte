import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommunicationService } from '@app/services/communication.service';
import { Observable } from 'rxjs';

import { AdminPageComponent } from './admin-page.component';

fdescribe('AdminPageComponent', () => {
    let component: AdminPageComponent;
    let fixture: ComponentFixture<AdminPageComponent>;
    let communicationServiceSpy: jasmine.SpyObj<CommunicationService>;

    beforeEach(async () => {
        communicationServiceSpy = jasmine.createSpyObj('CommunicationService', [
            'getDictionaryList',
            'reinitialiseDictionary',
            'sendDictionaryNameChanged',
            'sendDeleteDictionary',
            'getFullDictionary',
        ]);
        communicationServiceSpy.getDictionaryList.and.returnValue(new Observable());
        await TestBed.configureTestingModule({
            declarations: [AdminPageComponent],
            providers: [{ provide: CommunicationService, useValue: communicationServiceSpy }],
        }).compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
