import { TestBed } from '@angular/core/testing';
import { UsefullFunctionService } from './usefull-function.service';

describe('UsefullFunctionService', () => {
    let service: UsefullFunctionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UsefullFunctionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
