import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffectationConteneurComponent } from './affectation-conteneur.component';

describe('AffectationConteneurComponent', () => {
  let component: AffectationConteneurComponent;
  let fixture: ComponentFixture<AffectationConteneurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AffectationConteneurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AffectationConteneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
