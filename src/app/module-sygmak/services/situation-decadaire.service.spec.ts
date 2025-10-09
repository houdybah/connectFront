import { TestBed } from '@angular/core/testing';

import { SituationDecadaireService } from './situation-decadaire.service';

describe('SituationDecadaireService', () => {
  let service: SituationDecadaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SituationDecadaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
