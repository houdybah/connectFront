import { TestBed } from '@angular/core/testing';

import { NifUtilisateurService } from './nif-utilisateur.service';

describe('NifUtilisateurService', () => {
  let service: NifUtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NifUtilisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
