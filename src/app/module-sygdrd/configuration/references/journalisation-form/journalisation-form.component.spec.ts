import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalisationFormComponent } from './journalisation-form.component';

describe('JournalisationFormComponent', () => {
  let component: JournalisationFormComponent;
  let fixture: ComponentFixture<JournalisationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JournalisationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalisationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








