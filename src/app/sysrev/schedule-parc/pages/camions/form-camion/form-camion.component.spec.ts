import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCamionComponent } from './form-Camion.component';

describe('FormCamionComponent', () => {
  let component: FormCamionComponent;
  let fixture: ComponentFixture<FormCamionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCamionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCamionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


