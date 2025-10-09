import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualisationListComponent } from './mensualisation-list.component';

describe('MensualisationListComponent', () => {
  let component: MensualisationListComponent;
  let fixture: ComponentFixture<MensualisationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MensualisationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualisationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








