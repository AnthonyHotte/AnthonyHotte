import { TestBed } from '@angular/core/testing';
import { RefreshServiceService } from './refresh-service.service';
describe('RefreshServiceService', () => {
    let service: RefreshServiceService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(RefreshServiceService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('refresh should call set need refresh to false', () => {
        const mySpy = spyOn(service, 'windowRefresh');
        service.refresh();
        expect(service.needRefresh).toBeFalse();
        expect(mySpy).toHaveBeenCalled();
    });
});
