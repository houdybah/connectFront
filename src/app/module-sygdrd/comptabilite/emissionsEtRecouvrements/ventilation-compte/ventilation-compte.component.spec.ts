import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentilationCompteComponent } from './ventilation-compte.component';

describe('VentilationCompteComponent', () => {
  let component: VentilationCompteComponent;
  let fixture: ComponentFixture<VentilationCompteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentilationCompteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentilationCompteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








