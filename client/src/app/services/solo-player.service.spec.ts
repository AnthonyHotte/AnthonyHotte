import { TestBed } from '@angular/core/testing';

import { SoloPlayerService } from './solo-player.service';

describe('SoloPlayerService', () => {
  let service: SoloPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoloPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
