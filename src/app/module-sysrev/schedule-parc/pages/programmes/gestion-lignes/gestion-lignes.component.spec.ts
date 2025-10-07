import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionLignesComponent } from './gestion-lignes.component';

describe('GestionLignesComponent', () => {
  let component: GestionLignesComponent;
  let fixture: ComponentFixture<GestionLignesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionLignesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionLignesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
