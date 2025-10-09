import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableResteArecouvrerComponent } from './table-reste-arecouvrer.component';

describe('TableResteArecouvrerComponent', () => {
  let component: TableResteArecouvrerComponent;
  let fixture: ComponentFixture<TableResteArecouvrerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableResteArecouvrerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableResteArecouvrerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








