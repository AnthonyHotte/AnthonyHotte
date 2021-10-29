import { TestBed } from '@angular/core/testing';

import { ClickManagementService } from './click-management.service';
import { LetterService } from './letter.service';
import { PlaceLetterClickService } from './place-letter-click.service';

describe('ClickManagementService', () => {
    let service: ClickManagementService;
    let letterServiceSpy: LetterService;
    let placeLetterServiceClickSPy: PlaceLetterClickService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClickManagementService);
        letterServiceSpy = TestBed.inject(LetterService) as jasmine.SpyObj<LetterService>;
        placeLetterServiceClickSPy = TestBed.inject(PlaceLetterClickService) as jasmine.SpyObj<PlaceLetterClickService>;
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('click should call manage view', () => {
        const mySpy = spyOn(service, 'manageView');
        service.click('hand');
        expect(mySpy).toHaveBeenCalled();
    });

    it('manageView should call removeAttributesExchange, removeAttributesSwapping and reset when active location is textBox', () => {
        service.activeLocation = 'textBox';
        const mySpy = spyOn(letterServiceSpy, 'removeAttributesExchange');
        const mySpy2 = spyOn(letterServiceSpy, 'removeAttributesSwapping');
        const mySpy3 = spyOn(placeLetterServiceClickSPy, 'reset');
        service.manageView();
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
        expect(mySpy3).toHaveBeenCalled();
    });

    it('manageView should call reset when active location is hand', () => {
        service.activeLocation = 'hand';
        const mySpy = spyOn(placeLetterServiceClickSPy, 'reset');
        service.manageView();
        expect(mySpy).toHaveBeenCalled();
    });

    it('manageView should call removeAttributesExchange and removeAttributesSwapping when active location is gameBoard', () => {
        service.activeLocation = 'gameBoard';
        const mySpy = spyOn(letterServiceSpy, 'removeAttributesExchange');
        const mySpy2 = spyOn(letterServiceSpy, 'removeAttributesSwapping');
        service.manageView();
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });

    it('manageView should call removeAttributesExchange and removeAttributesSwapping when active location is sidebarRight', () => {
        service.activeLocation = 'sidebarRight';
        const mySpy = spyOn(letterServiceSpy, 'removeAttributesExchange');
        const mySpy2 = spyOn(letterServiceSpy, 'removeAttributesSwapping');
        service.manageView();
        expect(mySpy).toHaveBeenCalled();
        expect(mySpy2).toHaveBeenCalled();
    });
});
