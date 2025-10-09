import { TestBed } from '@angular/core/testing';

import { QuittanceHelperService } from './quittance-helper.service';

describe('QuittanceHelperService', () => {
  let service: QuittanceHelperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuittanceHelperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


