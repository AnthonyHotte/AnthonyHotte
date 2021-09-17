import { TestBed } from '@angular/core/testing';
import { UsefullFunctionService } from './usefull-function.service';

/* usefullFunctionWrapper(){
    const text = service.fileReaderFunction('../../assets/insulte.txt');
    return text;
}*/

describe('UsefullFunctionService', () => {
    let service: UsefullFunctionService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UsefullFunctionService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    /* it('should call ', () => {
        service.
        expect(service).toBeTruthy();
    });*/
});
