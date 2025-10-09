import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureRecetteListComponent } from './nature-recette-list.component';

describe('NatureRecetteListComponent', () => {
  let component: NatureRecetteListComponent;
  let fixture: ComponentFixture<NatureRecetteListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NatureRecetteListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NatureRecetteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








