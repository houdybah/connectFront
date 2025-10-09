import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RubriqueFormComponent } from './rubrique-form.component';

describe('RubriqueFormComponent', () => {
  let component: RubriqueFormComponent;
  let fixture: ComponentFixture<RubriqueFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RubriqueFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RubriqueFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








