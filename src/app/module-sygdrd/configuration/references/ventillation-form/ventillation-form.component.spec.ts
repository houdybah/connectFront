import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentillationFormComponent } from './ventillation-form.component';

describe('VentillationFormComponent', () => {
  let component: VentillationFormComponent;
  let fixture: ComponentFixture<VentillationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VentillationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentillationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








