import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoisFinanceFormComponent } from './lois-finance-form.component';

describe('LoisFinanceFormComponent', () => {
  let component: LoisFinanceFormComponent;
  let fixture: ComponentFixture<LoisFinanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoisFinanceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoisFinanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








