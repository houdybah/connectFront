import { TestBed } from '@angular/core/testing';

import { QuotaAnnuelService } from './quota-annuel.service';

describe('QuotaAnnuelService', () => {
  let service: QuotaAnnuelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuotaAnnuelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});







