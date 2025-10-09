import { TestBed } from '@angular/core/testing';

import { MensualisationService } from './mensualisation.service';

describe('MensualisationService', () => {
  let service: MensualisationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MensualisationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});







