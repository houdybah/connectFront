import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RarParCodeBudgetComponent } from './rar-par-code-budget.component';

describe('RarParCodeBudgetComponent', () => {
  let component: RarParCodeBudgetComponent;
  let fixture: ComponentFixture<RarParCodeBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RarParCodeBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RarParCodeBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








