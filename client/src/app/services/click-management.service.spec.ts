import { TestBed } from '@angular/core/testing';

import { ClickManagementService } from './click-management.service';

describe('ClickManagementService', () => {
    let service: ClickManagementService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ClickManagementService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
