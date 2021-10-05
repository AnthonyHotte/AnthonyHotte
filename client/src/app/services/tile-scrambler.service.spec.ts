import { TestBed } from '@angular/core/testing';

import { TileScramblerService } from './tile-scrambler.service';

describe('TileScramblerService', () => {
  let service: TileScramblerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TileScramblerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
