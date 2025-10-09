import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentillationListComponent } from './ventillation-list.component';

describe('VentillationListComponent', () => {
  let component: VentillationListComponent;
  let fixture: ComponentFixture<VentillationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentillationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentillationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








