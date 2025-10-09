import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeProduitRubriqueListComponent } from './type-produit-rubrique-list.component';

describe('TypeProduitRubriqueListComponent', () => {
  let component: TypeProduitRubriqueListComponent;
  let fixture: ComponentFixture<TypeProduitRubriqueListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TypeProduitRubriqueListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeProduitRubriqueListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








