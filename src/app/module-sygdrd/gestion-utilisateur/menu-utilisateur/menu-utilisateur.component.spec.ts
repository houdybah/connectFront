import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuUtilisateurComponent } from './menu-utilisateur.component';

describe('MenuUtilisateurComponent', () => {
  let component: MenuUtilisateurComponent;
  let fixture: ComponentFixture<MenuUtilisateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuUtilisateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuUtilisateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});








