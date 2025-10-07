import { TestBed } from '@angular/core/testing';

import { DemandeCktService } from './demande-ckt.service';

describe('DemandeCktService', () => {
  let service: DemandeCktService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemandeCktService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


