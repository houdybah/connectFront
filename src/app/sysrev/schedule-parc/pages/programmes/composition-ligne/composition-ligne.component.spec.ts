import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompositionLigneComponent } from './composition-Ligne.component';

describe('CompositionLigneComponent', () => {
  let component: CompositionLigneComponent;
  let fixture: ComponentFixture<CompositionLigneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompositionLigneComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompositionLigneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


