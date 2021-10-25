import { TestBed } from '@angular/core/testing';

import { EmitToServer } from '@app/services/emit-to-server.service';
import { RouterTestingModule } from '@angular/router/testing';

describe('EmitToServer.TsService', () => {
    let service: EmitToServer;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
        });
        service = TestBed.inject(EmitToServer);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
