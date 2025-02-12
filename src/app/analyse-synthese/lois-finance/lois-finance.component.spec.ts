import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoisFinanceComponent } from './lois-finance.component';

describe('LoisFinanceComponent', () => {
  let component: LoisFinanceComponent;
  let fixture: ComponentFixture<LoisFinanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoisFinanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoisFinanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
