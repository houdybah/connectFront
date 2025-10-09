import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDeclarationComponent } from './menu-declaration.component';

describe('MenuDeclarationComponent', () => {
  let component: MenuDeclarationComponent;
  let fixture: ComponentFixture<MenuDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDeclarationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





