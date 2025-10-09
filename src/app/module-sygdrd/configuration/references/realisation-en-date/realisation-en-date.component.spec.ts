import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationEnDateComponent } from './realisation-en-date.component';

describe('RealisationEnDateComponent', () => {
  let component: RealisationEnDateComponent;
  let fixture: ComponentFixture<RealisationEnDateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealisationEnDateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealisationEnDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








