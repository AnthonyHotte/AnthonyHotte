import { TestBed } from '@angular/core/testing';

import { EmitToServer } from '@app/services/emit-to-server.service';

describe('EmitToServer.TsService', () => {
    let service: EmitToServer;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EmitToServer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
