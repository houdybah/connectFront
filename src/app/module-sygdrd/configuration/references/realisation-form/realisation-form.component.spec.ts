import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RealisationFormComponent } from './realisation-form.component';

describe('RealisationFormComponent', () => {
  let component: RealisationFormComponent;
  let fixture: ComponentFixture<RealisationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RealisationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RealisationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








