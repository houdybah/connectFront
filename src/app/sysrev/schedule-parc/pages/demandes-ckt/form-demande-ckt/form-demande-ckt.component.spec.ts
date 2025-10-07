import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDemandeCktComponent } from './form-demande-ckt.component';

describe('FormDemandeCktComponent', () => {
  let component: FormDemandeCktComponent;
  let fixture: ComponentFixture<FormDemandeCktComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDemandeCktComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormDemandeCktComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
