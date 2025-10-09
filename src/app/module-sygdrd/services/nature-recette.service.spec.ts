import { TestBed } from '@angular/core/testing';

import { NatureRecetteService } from './nature-recette.service';

describe('NatureRecetteService', () => {
  let service: NatureRecetteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NatureRecetteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});







