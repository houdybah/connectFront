import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardSdtComponent } from './Dashboard-sdt.component';

describe('DashboardSdtComponent', () => {
  let component: DashboardSdtComponent;
  let fixture: ComponentFixture<DashboardSdtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardSdtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardSdtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



