import { TestBed } from '@angular/core/testing';

import { SoloModeInformationsService } from './solo-mode-informations.service';

describe('SoloModeInformationsService', () => {
  let service: SoloModeInformationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoloModeInformationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
