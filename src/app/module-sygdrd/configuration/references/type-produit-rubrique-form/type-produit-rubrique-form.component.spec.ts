import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProduitRubriqueFormComponent } from './type-produit-rubrique-form.component';

describe('TypeProduitRubriqueFormComponent', () => {
  let component: TypeProduitRubriqueFormComponent;
  let fixture: ComponentFixture<TypeProduitRubriqueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeProduitRubriqueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeProduitRubriqueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








