import { TestBed } from '@angular/core/testing';

import { ClickManagementService } from './click-management.service';
import { LetterService } from './letter.service';
import { PlaceLetterClickService } from './place-letter-click.service';

describe('ClickManagementService', () => {
    let service: ClickManagementService;
    let letterServiceSpy: LetterService;
    let placeLetterServiceClickSPy: PlaceLetterClickService;
    beforeEach(async () => {
        placeLetterServiceClickSPy = jasmine.createSpyObj('PlaceLetterClickService', ['placeLetter', 'reset']);
        letterServiceSpy = jasmine.createSpyObj('LetterService', ['reset', 'removeAttributesExchange', 'removeAttributesSwapping']);
        TestBed.configureTestingModule({
            providers: [
                { provide: PlaceLetterClickService, useValue: placeLetterServiceClickSPy },
                { provide: LetterService, useValue: letterServiceSpy },
            ],
        }).compileComponents();
    });

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClickManagementService);
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
        service.manageView();
        expect(letterServiceSpy.removeAttributesSwapping).toHaveBeenCalled();
        expect(letterServiceSpy.removeAttributesExchange).toHaveBeenCalled();
        expect(placeLetterServiceClickSPy.reset).toHaveBeenCalled();
    });

    it('manageView should call reset when active location is hand', () => {
        service.activeLocation = 'hand';
        service.manageView();
        expect(placeLetterServiceClickSPy.reset).toHaveBeenCalled();
    });

    it('manageView should call removeAttributesExchange and removeAttributesSwapping when active location is gameBoard', () => {
        service.activeLocation = 'gameBoard';
        service.manageView();
        expect(letterServiceSpy.removeAttributesExchange).toHaveBeenCalled();
        expect(letterServiceSpy.removeAttributesSwapping).toHaveBeenCalled();
    });

    it('manageView should call removeAttributesExchange and removeAttributesSwapping when active location is sidebarRight', () => {
        service.activeLocation = 'sidebarRight';
        service.manageView();
        expect(letterServiceSpy.removeAttributesExchange).toHaveBeenCalled();
        expect(letterServiceSpy.removeAttributesSwapping).toHaveBeenCalled();
    });
});
