import { TestBed } from '@angular/core/testing';

import { DetailConteneurAffectationService } from './detail-conteneur-affectation.service';

describe('DetailConteneurAffectationService', () => {
  let service: DetailConteneurAffectationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DetailConteneurAffectationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


