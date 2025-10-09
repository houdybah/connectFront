import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationCumulComponent } from './realisation-cumul.component';

describe('RealisationCumulComponent', () => {
  let component: RealisationCumulComponent;
  let fixture: ComponentFixture<RealisationCumulComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealisationCumulComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealisationCumulComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








