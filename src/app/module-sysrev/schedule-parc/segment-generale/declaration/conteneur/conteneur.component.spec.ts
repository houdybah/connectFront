import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConteneurComponent } from './conteneur.component';

describe('ConteneurComponent', () => {
  let component: ConteneurComponent;
  let fixture: ComponentFixture<ConteneurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConteneurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConteneurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
