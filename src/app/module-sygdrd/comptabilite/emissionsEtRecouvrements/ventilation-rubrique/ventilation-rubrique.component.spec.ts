import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VentilationRubriqueComponent } from './ventilation-rubrique.component';

describe('VentilationRubriqueComponent', () => {
  let component: VentilationRubriqueComponent;
  let fixture: ComponentFixture<VentilationRubriqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VentilationRubriqueComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VentilationRubriqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








