import { TestBed } from '@angular/core/testing';

import { SituationDeclarationService } from './situation-declaration.service';

describe('SituationDeclarationService', () => {
  let service: SituationDeclarationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SituationDeclarationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});


