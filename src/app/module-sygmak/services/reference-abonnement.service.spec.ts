import { TestBed } from '@angular/core/testing';

import { ReferenceAbonnementService } from './reference-abonnement.service';

describe('ReferenceAbonnementService', () => {
  let service: ReferenceAbonnementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReferenceAbonnementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
