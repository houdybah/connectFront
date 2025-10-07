import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclarationListComponent } from './Declaration-list.component';

describe('DeclarationListComponent', () => {
  let component: DeclarationListComponent;
  let fixture: ComponentFixture<DeclarationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeclarationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclarationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

