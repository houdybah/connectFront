import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecetteDouaneComponent } from './recette-douane.component';

describe('RecetteDouaneComponent', () => {
  let component: RecetteDouaneComponent;
  let fixture: ComponentFixture<RecetteDouaneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecetteDouaneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecetteDouaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








