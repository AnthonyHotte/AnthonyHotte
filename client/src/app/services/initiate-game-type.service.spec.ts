import { TestBed } from '@angular/core/testing';

import { InitiateGameTypeService } from './initiate-game-type.service';

describe('InitiateGameType.Service.TsService', () => {
    let service: InitiateGameTypeService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(InitiateGameTypeService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
