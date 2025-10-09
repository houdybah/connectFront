import { TestBed } from '@angular/core/testing';

import { TypeProduitRubriqueService } from './type-produit-rubrique.service';

describe('TypeProduitRubriqueService', () => {
  let service: TypeProduitRubriqueService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TypeProduitRubriqueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});







