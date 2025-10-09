import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionFtComponent } from './transaction-ft.component';

describe('TransactionFtComponent', () => {
  let component: TransactionFtComponent;
  let fixture: ComponentFixture<TransactionFtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TransactionFtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransactionFtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








