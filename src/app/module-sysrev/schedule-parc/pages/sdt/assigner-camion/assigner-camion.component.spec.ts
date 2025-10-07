import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignerCamionComponent } from './assigner-Camion.component';

describe('AssignerCamionComponent', () => {
  let component: AssignerCamionComponent;
  let fixture: ComponentFixture<AssignerCamionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignerCamionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignerCamionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


