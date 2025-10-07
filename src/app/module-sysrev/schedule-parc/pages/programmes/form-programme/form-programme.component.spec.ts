import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormProgrammeComponent } from './form-Programme.component';

describe('FormProgrammeComponent', () => {
  let component: FormProgrammeComponent;
  let fixture: ComponentFixture<FormProgrammeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormProgrammeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


