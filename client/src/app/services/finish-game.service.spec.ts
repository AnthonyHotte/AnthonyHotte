import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { FinishGameService } from './finish-game.service';

describe('FinishGameService', () => {
    let service: FinishGameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [RouterModule],
            imports: [RouterTestingModule],
        });
        service = TestBed.inject(FinishGameService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
