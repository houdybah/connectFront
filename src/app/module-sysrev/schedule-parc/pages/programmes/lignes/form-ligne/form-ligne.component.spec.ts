import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormLigneComponent } from './form-Ligne.component';

describe('FormLigneComponent', () => {
  let component: FormLigneComponent;
  let fixture: ComponentFixture<FormLigneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormLigneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


