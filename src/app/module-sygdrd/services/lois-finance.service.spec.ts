import { TestBed } from '@angular/core/testing';

import { LoisFinanceService } from './lois-finance.service';

describe('LoisFinanceService', () => {
  let service: LoisFinanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoisFinanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});







