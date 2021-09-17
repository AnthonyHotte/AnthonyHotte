import { TestBed } from '@angular/core/testing';

import { PlaceLettersService } from './place-letters.service';

describe('PlaceLettersService', () => {
  let service: PlaceLettersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlaceLettersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
