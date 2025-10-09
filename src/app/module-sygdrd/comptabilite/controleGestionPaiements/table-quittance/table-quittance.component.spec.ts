import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableQuittanceComponent } from './table-quittance.component';

describe('TableQuittanceComponent', () => {
  let component: TableQuittanceComponent;
  let fixture: ComponentFixture<TableQuittanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableQuittanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableQuittanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








