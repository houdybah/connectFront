import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExerciceFormComponent } from './exercice-form.component';

describe('ExerciceFormComponent', () => {
  let component: ExerciceFormComponent;
  let fixture: ComponentFixture<ExerciceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExerciceFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExerciceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








