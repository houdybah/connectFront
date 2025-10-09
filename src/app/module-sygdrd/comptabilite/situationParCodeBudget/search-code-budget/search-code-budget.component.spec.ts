import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchCodeBudgetComponent } from './search-code-budget.component';

describe('SearchCodeBudgetComponent', () => {
  let component: SearchCodeBudgetComponent;
  let fixture: ComponentFixture<SearchCodeBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SearchCodeBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SearchCodeBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








