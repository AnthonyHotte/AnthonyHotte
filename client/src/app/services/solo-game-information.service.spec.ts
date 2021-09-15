import { TestBed } from '@angular/core/testing';

import { SoloGameInformationService } from './solo-game-information.service';

describe('SoloGameInformationService', () => {
  let service: SoloGameInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoloGameInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
