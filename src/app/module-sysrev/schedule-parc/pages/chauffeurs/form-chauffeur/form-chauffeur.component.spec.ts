import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormChauffeurComponent } from './form-Chauffeur.component';

describe('FormChauffeurComponent', () => {
  let component: FormChauffeurComponent;
  let fixture: ComponentFixture<FormChauffeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormChauffeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormChauffeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


