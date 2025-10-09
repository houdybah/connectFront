import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoisFinanceListComponent } from './lois-finance-list.component';

describe('LoisFinanceListComponent', () => {
  let component: LoisFinanceListComponent;
  let fixture: ComponentFixture<LoisFinanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoisFinanceListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoisFinanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








