import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferenceAbonnementFormComponent } from './reference-abonnement-form.component';

describe('ReferenceAbonnementFormComponent', () => {
  let component: ReferenceAbonnementFormComponent;
  let fixture: ComponentFixture<ReferenceAbonnementFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferenceAbonnementFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferenceAbonnementFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});





