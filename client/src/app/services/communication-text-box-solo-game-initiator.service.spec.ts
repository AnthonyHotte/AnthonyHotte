import { TestBed } from '@angular/core/testing';

import { CommunicationTextBoxSoloGameInitiatorService } from './communication-text-box-solo-game-initiator.service';

describe('CommunicationTextBoxSoloGameInitiatorService', () => {
    let service: CommunicationTextBoxSoloGameInitiatorService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CommunicationTextBoxSoloGameInitiatorService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
