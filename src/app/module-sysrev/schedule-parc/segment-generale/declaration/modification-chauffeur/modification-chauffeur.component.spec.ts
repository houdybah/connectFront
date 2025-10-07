import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificationChauffeurComponent } from './modification-Chauffeur.component';

describe('ModificationChauffeurComponent', () => {
  let component: ModificationChauffeurComponent;
  let fixture: ComponentFixture<ModificationChauffeurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationChauffeurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModificationChauffeurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


