import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableProvisoireComponent } from './table-provisoire.component';

describe('TableProvisoireComponent', () => {
  let component: TableProvisoireComponent;
  let fixture: ComponentFixture<TableProvisoireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableProvisoireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableProvisoireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








