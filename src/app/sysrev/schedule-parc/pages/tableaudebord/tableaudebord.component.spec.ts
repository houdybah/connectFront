import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableaudebordComponent } from './Tableaudebord.component';

describe('DashboardComponent', () => {
  let component: TableaudebordComponent;
  let fixture: ComponentFixture<TableaudebordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableaudebordComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableaudebordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
