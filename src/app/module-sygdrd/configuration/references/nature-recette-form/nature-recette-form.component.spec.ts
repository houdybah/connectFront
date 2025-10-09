import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureRecetteFormComponent } from './nature-recette-form.component';

describe('NatureRecetteFormComponent', () => {
  let component: NatureRecetteFormComponent;
  let fixture: ComponentFixture<NatureRecetteFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NatureRecetteFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NatureRecetteFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








