import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualisationFormComponent } from './mensualisation-form.component';

describe('MensualisationFormComponent', () => {
  let component: MensualisationFormComponent;
  let fixture: ComponentFixture<MensualisationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MensualisationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualisationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








