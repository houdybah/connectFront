import { TestBed } from '@angular/core/testing';

import { ConteneurService } from './conteneur.service';

describe('ConteneurService', () => {
  let service: ConteneurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConteneurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


