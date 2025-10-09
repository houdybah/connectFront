import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotaFormComponent } from './quota-form.component';

describe('QuotaFormComponent', () => {
  let component: QuotaFormComponent;
  let fixture: ComponentFixture<QuotaFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [QuotaFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuotaFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








