import { TestBed } from '@angular/core/testing';

import { IndexWaitingRoomService } from './index-waiting-room.service';

describe('IndexWaitingRoomService', () => {
    let service: IndexWaitingRoomService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(IndexWaitingRoomService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
    it('getIndex should return index', () => {
        service.setIndex(1);
        expect(service.getIndex()).toEqual(1);
    });
});
