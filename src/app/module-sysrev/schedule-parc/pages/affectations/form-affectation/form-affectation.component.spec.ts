import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormAffectationComponent } from './form-affectation.component';

describe('FormAffectationComponent', () => {
  let component: FormAffectationComponent;
  let fixture: ComponentFixture<FormAffectationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormAffectationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormAffectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
