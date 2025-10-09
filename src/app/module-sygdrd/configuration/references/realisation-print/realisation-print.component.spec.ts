import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationPrintComponent } from './realisation-print.component';

describe('RealisationPrintComponent', () => {
  let component: RealisationPrintComponent;
  let fixture: ComponentFixture<RealisationPrintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealisationPrintComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealisationPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








