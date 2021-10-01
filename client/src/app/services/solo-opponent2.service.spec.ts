import { TestBed } from '@angular/core/testing';

import { SoloOpponent2Service } from './solo-opponent2.service';

describe('SoloOpponent2Service', () => {
  let service: SoloOpponent2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SoloOpponent2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
