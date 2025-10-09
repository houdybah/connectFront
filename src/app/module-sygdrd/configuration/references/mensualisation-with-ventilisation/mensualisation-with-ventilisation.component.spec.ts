import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualisationWithVentilisationComponent } from './mensualisation-with-ventilisation.component';

describe('MensualisationWithVentilisationComponent', () => {
  let component: MensualisationWithVentilisationComponent;
  let fixture: ComponentFixture<MensualisationWithVentilisationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MensualisationWithVentilisationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualisationWithVentilisationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








