import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableCodeBudgetComponent } from './table-code-budget.component';

describe('TableCodeBudgetComponent', () => {
  let component: TableCodeBudgetComponent;
  let fixture: ComponentFixture<TableCodeBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableCodeBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableCodeBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








