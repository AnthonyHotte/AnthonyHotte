import { TestBed } from '@angular/core/testing';

import { GestionTimerTourService } from './gestion-timer-tour.service';

describe('GestionTimerTourService', () => {
  let service: GestionTimerTourService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestionTimerTourService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
