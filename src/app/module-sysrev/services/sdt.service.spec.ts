import { TestBed } from '@angular/core/testing';

import { SdtService } from './sdt.service';

describe('SdtService', () => {
  let service: SdtService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SdtService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


