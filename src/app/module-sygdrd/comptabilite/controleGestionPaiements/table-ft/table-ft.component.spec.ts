import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableFtComponent } from './table-ft.component';

describe('TableFtComponent', () => {
  let component: TableFtComponent;
  let fixture: ComponentFixture<TableFtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableFtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableFtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








